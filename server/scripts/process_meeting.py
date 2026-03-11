
import sys
import os
import json
from google import genai
from moviepy import VideoFileClip
from faster_whisper import WhisperModel

# GEMINI_API_KEY is handled by the Client automatically if in env, or passed explicitly
api_key = os.environ.get("GEMINI_API_KEY")

def extract_audio(video_path, audio_path):
    print(f"Extracting audio to {audio_path}...", file=sys.stderr)
    try:
        clip = VideoFileClip(video_path)
        # Using 'libopus' codec for webm, with a higher bitrate for better quality
        # Resampling to 48000 Hz to be compatible with libopus encoder
        clip.audio.write_audiofile(audio_path, codec='libopus', bitrate='128k', fps=48000, logger=None)
        clip.close()
    except Exception as e:
        print(f"Error extracting audio: {e}", file=sys.stderr)
        raise e

def transcribe(audio_path):
    print("Transcribing audio...", file=sys.stderr)
    # Faster-Whisper automatically detects CUDA. If not available, it defaults to CPU.
    # For Mac, we force CPU to avoid CUDA errors if not correctly detected or supported.
    device = "cuda" if "cuda" in os.environ.get("PATH", "").lower() else "cpu"
    # Overriding to cpu for safety on Mac unless user explicitly has setup
    device = "cpu" 
    
    model = WhisperModel("base", device=device, compute_type="int8")
    segments, info = model.transcribe(audio_path, beam_size=5)
    
    transcript = ""
    for segment in segments:
        transcript += segment.text + " "
    return transcript.strip()

def analyze_meeting(transcript):
    print("Analyzing meeting with Gemini...", file=sys.stderr)
    
    if not api_key:
         return {
            "summary": "Error: GEMINI_API_KEY not found.",
            "decisions": [],
            "tasks": []
        }

    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    Analyze the following meeting transcript.
    Extract:
    1. A concise summary.
    2. A list of key decisions made (with category, current value, proposed value, status).
    3. A list of action items/tasks (with title, assignee, priority).

    Output purely valid JSON in this format:
    {{
        "summary": "...",
        "decisions": [
            {{ "category": "...", "currentValue": "...", "proposedValue": "...", "status": "..." }}
        ],
        "tasks": [
            {{ "title": "...", "assignee": "...", "priority": "..." }}
        ]
    }}

    Transcript:
    {transcript}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-3-flash-preview', 
            contents=prompt
        )
        
        # Cleanup json block if present
        text = response.text
        # print(f"DEBUG_GEMINI_RESPONSE: {text}", file=sys.stderr) 
        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "")
        return json.loads(text)
    except Exception as e:
        print(f"Error parsing Gemini response or Model not found: {e}", file=sys.stderr)
        # Fallback to text parsing or return partial
        return {
            "summary": "Error analyzing meeting. " + str(e),
            "decisions": [],
            "tasks": []
        }

def main():
    if len(sys.argv) < 2:
        print("Usage: python process_meeting.py <video_path>", file=sys.stderr)
        sys.exit(1)
        
    video_path = sys.argv[1]
    base_name = os.path.splitext(video_path)[0]
    # Changed to .webm for libopus compatibility
    audio_path = f"{base_name}.webm" 
    
    try:
        # 1. Extract Audio
        extract_audio(video_path, audio_path)
        
        # 2. Transcribe
        transcript = transcribe(audio_path)
        
        # 3. Analyze
        analysis = analyze_meeting(transcript)
        
        # 4. Embed (Moving from Node.js to Python)
        embeddings = []
        try:
            print("Generating embeddings...", file=sys.stderr)
            client = genai.Client(api_key=api_key)
            
            # Simple chunking
            words = transcript.split()
            chunk_size = 500
            overlap = 50
            chunks = []
            for i in range(0, len(words), chunk_size - overlap):
                chunks.append(" ".join(words[i:i + chunk_size]))
                
            for chunk in chunks:
                if not chunk.strip():
                    continue
                try:
                    # Using text-embedding-004
                    embed_resp = client.models.embed_content(
                        model='text-embedding-004',
                        contents=chunk
                    )
                    
                    vector = None
                    if hasattr(embed_resp, 'embedding') and hasattr(embed_resp.embedding, 'values'):
                        vector = embed_resp.embedding.values
                    elif hasattr(embed_resp, 'embeddings') and len(embed_resp.embeddings) > 0:
                         vector = embed_resp.embeddings[0].values
                    
                    if vector:
                        embeddings.append({
                            "text": chunk,
                            "vector": vector
                        })
                except Exception as e:
                     print(f"Error embedding chunk: {e}", file=sys.stderr)
                     
        except Exception as e:
            print(f"Error in embedding execution: {e}", file=sys.stderr)

        # 5. Output Result
        result = {
            "transcript": transcript,
            "embeddings": embeddings,
            **analysis
        }
        
        print(json.dumps(result))
        
        # Cleanup
        if os.path.exists(audio_path):
            os.remove(audio_path)
            
    except Exception as e:
        print(f"Error processing meeting: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
