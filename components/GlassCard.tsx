
import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick, hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' } : {}}
      onClick={onClick}
      className={`glass rounded-2xl p-6 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};
