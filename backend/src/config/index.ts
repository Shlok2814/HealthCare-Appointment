import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET || 'pulsepoint_super_secure_jwt_secret_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  slotHoldMinutes: parseInt(process.env.SLOT_HOLD_MINUTES || '5', 10),
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development'
};
