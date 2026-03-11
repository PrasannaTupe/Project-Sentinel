
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoute = require('./routes/auth');
const meetingsRoute = require('./routes/meetings');
const chatRoute = require('./routes/chat');
const driftRoute = require('./routes/drift');
const tasksRoute = require('./routes/tasks');

app.use('/api/auth', authRoute);
app.use('/api/meetings', meetingsRoute);
app.use('/api/chat', chatRoute);
app.use('/api/drift', driftRoute);
app.use('/api/tasks', tasksRoute);

app.get('/', (req, res) => {
    res.send('Project Sentinel Backend Running');
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
