import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { config } from '../config';
import { UserRegisterInput, UserLoginInput } from '@pulsepoint/shared';
import { UserRole } from '@pulsepoint/shared';

export class AuthService {
  static async register(input: UserRegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase().trim() }
    });

    if (existing) {
      const error: any = new Error('An account with this email already exists.');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase().trim(),
        passwordHash,
        name: input.name.trim(),
        role: input.role as any,
        phone: input.phone || null,
        ...(input.role === UserRole.DOCTOR && {
          doctorProfile: {
            create: {
              specialization: input.specialization || 'General Practice',
              bio: input.bio || 'Experienced healthcare specialist dedicated to patient wellness.',
              consultationFee: input.consultationFee || 60.0,
              slotDurationMinutes: 30,
              workingHours: [
                { weekday: 1, startTime: '09:00', endTime: '17:00' },
                { weekday: 2, startTime: '09:00', endTime: '17:00' },
                { weekday: 3, startTime: '09:00', endTime: '17:00' },
                { weekday: 4, startTime: '09:00', endTime: '17:00' },
                { weekday: 5, startTime: '09:00', endTime: '17:00' }
              ]
            }
          }
        })
      },
      include: {
        doctorProfile: true
      }
    });

    const token = this.generateToken(user.id, user.email, user.role as UserRole, user.name);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone
      },
      token
    };
  }

  static async login(input: UserLoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
      include: { doctorProfile: true }
    });

    if (!user || !user.isActive) {
      const error: any = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      const error: any = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user.id, user.email, user.role as UserRole, user.name);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        doctorProfile: user.doctorProfile
      },
      token
    };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true }
    });

    if (!user) {
      const error: any = new Error('User profile not found.');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      doctorProfile: user.doctorProfile,
      createdAt: user.createdAt
    };
  }

  private static generateToken(userId: string, email: string, role: UserRole, name: string) {
    return jwt.sign(
      { userId, email, role, name },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );
  }
}
