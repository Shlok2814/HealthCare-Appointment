"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding PulsePoint Health database...');
    // Clear existing records in reverse dependency order
    await prisma.medicationAlert.deleteMany();
    await prisma.leaveResolutionAudit.deleteMany();
    await prisma.doctorLeave.deleteMany();
    await prisma.slotHold.deleteMany();
    await prisma.symptomIntake.deleteMany();
    await prisma.triageAssessment.deleteMany();
    await prisma.clinicalRecord.deleteMany();
    await prisma.patientSummary.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.doctorProfile.deleteMany();
    await prisma.user.deleteMany();
    const salt = await bcryptjs_1.default.genSalt(10);
    const adminPasswordHash = await bcryptjs_1.default.hash('Admin@1234', salt);
    const doctorPasswordHash = await bcryptjs_1.default.hash('Doctor@1234', salt);
    const patientPasswordHash = await bcryptjs_1.default.hash('Patient@1234', salt);
    // 1. Create System Admin
    const admin = await prisma.user.create({
        data: {
            email: 'admin@pulsepoint.health',
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
            name: 'Eleanor Sterling',
            phone: '+1 (555) 901-2244'
        }
    });
    console.log(`✅ Admin created: ${admin.email}`);
    // 2. Create Doctors
    const doctorsData = [
        {
            name: 'Dr. Sarah Jenkins, MD',
            email: 'dr.sarah@pulsepoint.health',
            specialization: 'Cardiology',
            bio: 'Board-certified Cardiologist with 14+ years of expertise in cardiovascular interventions and preventive lipidology.',
            consultationFee: 120.0,
            experienceYears: 14,
            rating: 4.95,
            workingHours: [
                { weekday: 1, startTime: '09:00', endTime: '17:00' },
                { weekday: 2, startTime: '09:00', endTime: '17:00' },
                { weekday: 3, startTime: '09:00', endTime: '17:00' },
                { weekday: 4, startTime: '09:00', endTime: '17:00' },
                { weekday: 5, startTime: '09:00', endTime: '17:00' }
            ]
        },
        {
            name: 'Dr. Marcus Vance, MD',
            email: 'dr.marcus@pulsepoint.health',
            specialization: 'Neurology',
            bio: 'Specialist in migraine management, neuromuscular disorders, and neuro-rehabilitation from Johns Hopkins.',
            consultationFee: 140.0,
            experienceYears: 11,
            rating: 4.88,
            workingHours: [
                { weekday: 1, startTime: '10:00', endTime: '18:00' },
                { weekday: 2, startTime: '10:00', endTime: '18:00' },
                { weekday: 3, startTime: '10:00', endTime: '18:00' },
                { weekday: 4, startTime: '10:00', endTime: '18:00' }
            ]
        },
        {
            name: 'Dr. Elena Rostova, MD',
            email: 'dr.elena@pulsepoint.health',
            specialization: 'Dermatology',
            bio: 'Clinical dermatologist focused on autoimmune skin conditions, acne scarring, and advanced dermoscopy.',
            consultationFee: 95.0,
            experienceYears: 8,
            rating: 4.92,
            workingHours: [
                { weekday: 2, startTime: '09:00', endTime: '16:30' },
                { weekday: 3, startTime: '09:00', endTime: '16:30' },
                { weekday: 4, startTime: '09:00', endTime: '16:30' },
                { weekday: 5, startTime: '09:00', endTime: '16:30' },
                { weekday: 6, startTime: '09:00', endTime: '14:00' }
            ]
        },
        {
            name: 'Dr. David Chen, MD',
            email: 'dr.david@pulsepoint.health',
            specialization: 'Orthopedics',
            bio: 'Consultant Orthopedic Surgeon specializing in arthroscopic sports injuries, joint preservation, and spine biomechanics.',
            consultationFee: 110.0,
            experienceYears: 16,
            rating: 4.97,
            workingHours: [
                { weekday: 1, startTime: '08:30', endTime: '16:30' },
                { weekday: 3, startTime: '08:30', endTime: '16:30' },
                { weekday: 5, startTime: '08:30', endTime: '16:30' }
            ]
        },
        {
            name: 'Dr. Ananya Sharma, MD',
            email: 'dr.ananya@pulsepoint.health',
            specialization: 'Pediatrics',
            bio: 'Compassionate pediatric specialist providing developmental assessments, immunization plans, and adolescent health care.',
            consultationFee: 85.0,
            experienceYears: 9,
            rating: 4.99,
            workingHours: [
                { weekday: 1, startTime: '09:00', endTime: '17:00' },
                { weekday: 2, startTime: '09:00', endTime: '17:00' },
                { weekday: 3, startTime: '09:00', endTime: '17:00' },
                { weekday: 4, startTime: '09:00', endTime: '17:00' },
                { weekday: 5, startTime: '09:00', endTime: '15:00' }
            ]
        }
    ];
    const createdDoctors = [];
    for (const doc of doctorsData) {
        const user = await prisma.user.create({
            data: {
                name: doc.name,
                email: doc.email,
                passwordHash: doctorPasswordHash,
                role: 'DOCTOR',
                phone: '+1 (555) 234-5678',
                doctorProfile: {
                    create: {
                        specialization: doc.specialization,
                        bio: doc.bio,
                        consultationFee: doc.consultationFee,
                        experienceYears: doc.experienceYears,
                        rating: doc.rating,
                        slotDurationMinutes: 30,
                        workingHours: doc.workingHours
                    }
                }
            },
            include: { doctorProfile: true }
        });
        createdDoctors.push(user);
        console.log(`✅ Doctor created: ${user.name} (${doc.specialization})`);
    }
    // 3. Create Patients
    const patient1 = await prisma.user.create({
        data: {
            name: 'Alex Reynolds',
            email: 'alex.reynolds@gmail.com',
            passwordHash: patientPasswordHash,
            role: 'PATIENT',
            phone: '+1 (555) 432-8899'
        }
    });
    const patient2 = await prisma.user.create({
        data: {
            name: 'Maya Patel',
            email: 'maya.patel@gmail.com',
            passwordHash: patientPasswordHash,
            role: 'PATIENT',
            phone: '+1 (555) 776-1122'
        }
    });
    const patient3 = await prisma.user.create({
        data: {
            name: 'Jordan Miller',
            email: 'jordan.miller@gmail.com',
            passwordHash: patientPasswordHash,
            role: 'PATIENT',
            phone: '+1 (555) 334-9988'
        }
    });
    console.log(`✅ Patients created: ${patient1.name}, ${patient2.name}, ${patient3.name}`);
    // 4. Create Sample Completed Appointment with AI Triage, Clinical Note, & Medication Schedule
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);
    pastDate.setUTCHours(10, 0, 0, 0);
    const pastEndDate = new Date(pastDate);
    pastEndDate.setMinutes(pastEndDate.getMinutes() + 30);
    const completedAppt = await prisma.appointment.create({
        data: {
            patientId: patient1.id,
            doctorId: createdDoctors[0].id, // Dr. Sarah Jenkins (Cardiology)
            slotStart: pastDate,
            slotEnd: pastEndDate,
            status: 'COMPLETED',
            symptomIntake: {
                create: {
                    symptomsDescription: 'Recurrent mild chest tightness after climbing stairs and occasional palpitations during morning workouts.'
                }
            },
            triageAssessment: {
                create: {
                    urgencyLevel: 'MODERATE',
                    primaryConcern: 'Exertional Sub-sternal Pressure & Tachycardia Evaluation',
                    suggestedDoctorQuestions: [
                        'How quickly does the chest tightness subside upon resting?',
                        'Have you experienced associated lightheadedness or radiation to jaw/shoulder?',
                        'What is your resting heart rate and daily caffeine intake?'
                    ],
                    rawAIOutput: 'Clinical rule-engine analyzed: exertional symptoms flagged for cardiovascular evaluation.',
                    status: 'SUCCESS'
                }
            },
            clinicalRecord: {
                create: {
                    diagnosis: 'Exertional Tachycardia & Stage-1 Benign Hypertension',
                    clinicalNotes: 'Resting ECG revealed sinus rhythm without ST-segment changes. BP measured 136/88 mmHg. Advised lipid panel, 24-hr Holter monitor, and lifestyle modulation.',
                    prescriptionsJson: [
                        {
                            medicationName: 'Metoprolol Succinate ER',
                            dosage: '25mg',
                            frequency: 'Once daily in the morning',
                            durationDays: 30,
                            instructions: 'Take with or immediately after breakfast with water.'
                        },
                        {
                            medicationName: 'Omega-3 EPA/DHA Complex',
                            dosage: '1000mg',
                            frequency: 'Once daily with dinner',
                            durationDays: 60,
                            instructions: 'Take with main evening meal.'
                        }
                    ]
                }
            },
            patientSummary: {
                create: {
                    careInstructions: 'You were evaluated for Stage-1 Benign Hypertension and exertional palpitations. Your initial resting ECG was reassuring. Please take your prescribed beta-blocker consistently every morning.',
                    medicationScheduleJson: [
                        {
                            medicine: 'Metoprolol Succinate ER',
                            dosage: '25mg',
                            frequency: 'Once daily in the morning',
                            durationDays: 30,
                            instructions: 'Take with or immediately after breakfast with water.'
                        },
                        {
                            medicine: 'Omega-3 EPA/DHA Complex',
                            dosage: '1000mg',
                            frequency: 'Once daily with dinner',
                            durationDays: 60,
                            instructions: 'Take with main evening meal.'
                        }
                    ],
                    followUpRecommendationsJson: [
                        'Log your blood pressure twice weekly at home.',
                        'Maintain low dietary sodium intake (<2,000mg/day).',
                        'Return in 4 weeks for follow-up review with Holter monitoring results.'
                    ]
                }
            }
        }
    });
    // Create active medication reminders
    await prisma.medicationAlert.createMany({
        data: [
            {
                appointmentId: completedAppt.id,
                patientId: patient1.id,
                medicationName: 'Metoprolol Succinate ER (25mg) - Morning dose',
                scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
                isSent: false
            },
            {
                appointmentId: completedAppt.id,
                patientId: patient1.id,
                medicationName: 'Omega-3 Complex (1000mg) - Evening dose',
                scheduledTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
                isSent: false
            }
        ]
    });
    // 5. Create Upcoming Confirmed Appointment for Patient 2
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    futureDate.setUTCHours(11, 0, 0, 0);
    const futureEndDate = new Date(futureDate);
    futureEndDate.setMinutes(futureEndDate.getMinutes() + 30);
    await prisma.appointment.create({
        data: {
            patientId: patient2.id,
            doctorId: createdDoctors[2].id, // Dr. Elena Rostova (Dermatology)
            slotStart: futureDate,
            slotEnd: futureEndDate,
            status: 'CONFIRMED',
            symptomIntake: {
                create: {
                    symptomsDescription: 'Persistent itchy dry erythematous patches on both elbows and knees for 3 weeks.'
                }
            },
            triageAssessment: {
                create: {
                    urgencyLevel: 'ROUTINE',
                    primaryConcern: 'Chronic Plaque Dermatitis / Eczematous Flare',
                    suggestedDoctorQuestions: [
                        'Do symptoms flare up with specific soaps or seasonal dry weather?',
                        'Is there any personal or family history of psoriasis or atopy?'
                    ],
                    status: 'SUCCESS'
                }
            }
        }
    });
    console.log('✨ Seed complete! PulsePoint Health is ready for clinical operation.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
