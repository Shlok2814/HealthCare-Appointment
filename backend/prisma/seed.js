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
            bio: 'Board-certified Cardiologist with 14+ years of expertise in cardiovascular interventions, lipidology, and preventive heart health.',
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
            bio: 'Specialist in migraine management, neuromuscular disorders, epilepsy, and neuro-rehabilitation from Johns Hopkins.',
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
            bio: 'Clinical dermatologist focused on autoimmune skin conditions, acne scarring, eczema, psoriasis, and advanced dermoscopy.',
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
            bio: 'Consultant Orthopedic Surgeon specializing in arthroscopic sports injuries, joint preservation, cartilage repair, and spine biomechanics.',
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
            bio: 'Compassionate pediatric specialist providing developmental milestone tracking, immunization schedules, and adolescent wellness.',
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
        },
        {
            name: 'Dr. Robert Hayes, MD',
            email: 'dr.robert@pulsepoint.health',
            specialization: 'Psychiatry',
            bio: 'Integrative psychiatrist specializing in mood disorders, adult ADHD, anxiety management, and psycho-pharmacology.',
            consultationFee: 135.0,
            experienceYears: 13,
            rating: 4.94,
            workingHours: [
                { weekday: 1, startTime: '11:00', endTime: '19:00' },
                { weekday: 2, startTime: '11:00', endTime: '19:00' },
                { weekday: 3, startTime: '11:00', endTime: '19:00' },
                { weekday: 4, startTime: '11:00', endTime: '19:00' }
            ]
        },
        {
            name: 'Dr. Fatima Al-Mansoor, MD',
            email: 'dr.fatima@pulsepoint.health',
            specialization: 'Endocrinology',
            bio: 'Leading Endocrinologist focused on complex diabetes management, thyroid dysfunctions, hormonal imbalances, and metabolic health.',
            consultationFee: 115.0,
            experienceYears: 12,
            rating: 4.91,
            workingHours: [
                { weekday: 1, startTime: '09:00', endTime: '16:00' },
                { weekday: 2, startTime: '09:00', endTime: '16:00' },
                { weekday: 4, startTime: '09:00', endTime: '16:00' },
                { weekday: 5, startTime: '09:00', endTime: '16:00' }
            ]
        },
        {
            name: 'Dr. James Wilson, MD',
            email: 'dr.james@pulsepoint.health',
            specialization: 'Ophthalmology',
            bio: 'Ophthalmic microsurgeon with deep expertise in corneal topography, glaucoma diagnostics, diabetic retinopathy, and laser vision.',
            consultationFee: 125.0,
            experienceYears: 15,
            rating: 4.96,
            workingHours: [
                { weekday: 2, startTime: '08:30', endTime: '16:30' },
                { weekday: 3, startTime: '08:30', endTime: '16:30' },
                { weekday: 4, startTime: '08:30', endTime: '16:30' },
                { weekday: 6, startTime: '09:00', endTime: '13:30' }
            ]
        },
        {
            name: 'Dr. Emily Watson, MD',
            email: 'dr.emily@pulsepoint.health',
            specialization: 'Gynecology',
            bio: 'Attending Ob-Gyn specializing in reproductive endocrinology, prenatal maternal care, and minimally invasive pelvic surgery.',
            consultationFee: 130.0,
            experienceYears: 10,
            rating: 4.98,
            workingHours: [
                { weekday: 1, startTime: '09:30', endTime: '17:30' },
                { weekday: 2, startTime: '09:30', endTime: '17:30' },
                { weekday: 3, startTime: '09:30', endTime: '17:30' },
                { weekday: 5, startTime: '09:30', endTime: '16:00' }
            ]
        },
        {
            name: 'Dr. Liam O\'Connor, MD',
            email: 'dr.liam@pulsepoint.health',
            specialization: 'Gastroenterology',
            bio: 'Gastroenterologist and Hepatologist specializing in irritable bowel syndrome (IBS), GERD, liver pathology, and endoscopy.',
            consultationFee: 110.0,
            experienceYears: 14,
            rating: 4.89,
            workingHours: [
                { weekday: 1, startTime: '08:00', endTime: '16:00' },
                { weekday: 3, startTime: '08:00', endTime: '16:00' },
                { weekday: 4, startTime: '08:00', endTime: '16:00' },
                { weekday: 5, startTime: '08:00', endTime: '15:00' }
            ]
        },
        {
            name: 'Dr. Samantha Brooks, MD',
            email: 'dr.samantha@pulsepoint.health',
            specialization: 'Oncology',
            bio: 'Hematologist-Oncologist specializing in precision molecular therapies, immunotherapy protocols, and genetic tumor profiling.',
            consultationFee: 160.0,
            experienceYears: 17,
            rating: 4.99,
            workingHours: [
                { weekday: 2, startTime: '09:00', endTime: '17:00' },
                { weekday: 3, startTime: '09:00', endTime: '17:00' },
                { weekday: 4, startTime: '09:00', endTime: '17:00' }
            ]
        },
        {
            name: 'Dr. Kenji Tanaka, MD',
            email: 'dr.kenji@pulsepoint.health',
            specialization: 'ENT (Otolaryngology)',
            bio: 'ENT surgeon with sub-specialization in chronic sinusitis, allergic rhinitis, vestibular balance disorders, and vocal cord micro-surgery.',
            consultationFee: 105.0,
            experienceYears: 11,
            rating: 4.93,
            workingHours: [
                { weekday: 1, startTime: '09:00', endTime: '17:00' },
                { weekday: 2, startTime: '09:00', endTime: '17:00' },
                { weekday: 4, startTime: '09:00', endTime: '17:00' },
                { weekday: 5, startTime: '09:00', endTime: '17:00' }
            ]
        },
        {
            name: 'Dr. Arthur Pendelton, MD',
            email: 'dr.arthur@pulsepoint.health',
            specialization: 'Pulmonology',
            bio: 'Pulmonologist and Critical Care specialist from Harvard Medical School focused on advanced asthma, COPD, interstitial lung disease, and sleep apnea.',
            consultationFee: 120.0,
            experienceYears: 15,
            rating: 4.96,
            workingHours: [
                { weekday: 1, startTime: '08:30', endTime: '16:30' },
                { weekday: 2, startTime: '08:30', endTime: '16:30' },
                { weekday: 3, startTime: '08:30', endTime: '16:30' },
                { weekday: 5, startTime: '08:30', endTime: '16:00' }
            ]
        },
        {
            name: 'Dr. Meera Nambiar, MD',
            email: 'dr.meera@pulsepoint.health',
            specialization: 'Rheumatology',
            bio: 'Stanford-trained clinical rheumatologist specializing in autoimmune pathologies, rheumatoid arthritis, lupus nephritis, and biologics therapy.',
            consultationFee: 130.0,
            experienceYears: 13,
            rating: 4.94,
            workingHours: [
                { weekday: 1, startTime: '09:00', endTime: '17:00' },
                { weekday: 3, startTime: '09:00', endTime: '17:00' },
                { weekday: 4, startTime: '09:00', endTime: '17:00' },
                { weekday: 5, startTime: '09:00', endTime: '16:00' }
            ]
        },
        {
            name: 'Dr. Julian Rivera, MD',
            email: 'dr.julian@pulsepoint.health',
            specialization: 'Urology',
            bio: 'Mayo Clinic fellowship-trained Urological Surgeon specializing in minimally invasive laparoscopic surgery, kidney stone removal, and prostate oncology.',
            consultationFee: 125.0,
            experienceYears: 14,
            rating: 4.92,
            workingHours: [
                { weekday: 2, startTime: '09:00', endTime: '17:00' },
                { weekday: 3, startTime: '09:00', endTime: '17:00' },
                { weekday: 4, startTime: '09:00', endTime: '17:00' },
                { weekday: 6, startTime: '09:00', endTime: '13:00' }
            ]
        },
        {
            name: 'Dr. Rachel Goldstein, MD',
            email: 'dr.rachel@pulsepoint.health',
            specialization: 'Allergy & Immunology',
            bio: 'Johns Hopkins Pediatric & Adult Allergist specializing in environmental immunotherapies, severe anaphylaxis, drug allergies, and chronic urticaria.',
            consultationFee: 100.0,
            experienceYears: 10,
            rating: 4.97,
            workingHours: [
                { weekday: 1, startTime: '09:00', endTime: '17:00' },
                { weekday: 2, startTime: '09:00', endTime: '17:00' },
                { weekday: 3, startTime: '09:00', endTime: '17:00' },
                { weekday: 4, startTime: '09:00', endTime: '17:00' }
            ]
        },
        {
            name: 'Dr. Tariq Al-Hassan, MD',
            email: 'dr.tariq@pulsepoint.health',
            specialization: 'Nephrology',
            bio: 'Cleveland Clinic Consultant Nephrologist expert in glomerular diseases, renal failure preservation, hypertension management, and transplant follow-up.',
            consultationFee: 135.0,
            experienceYears: 16,
            rating: 4.95,
            workingHours: [
                { weekday: 1, startTime: '08:00', endTime: '16:00' },
                { weekday: 2, startTime: '08:00', endTime: '16:00' },
                { weekday: 4, startTime: '08:00', endTime: '16:00' },
                { weekday: 5, startTime: '08:00', endTime: '15:00' }
            ]
        },
        {
            name: 'Dr. Chloe Desjardins, MD',
            email: 'dr.chloe@pulsepoint.health',
            specialization: 'Physical Medicine & Rehab',
            bio: 'Columbia University Chief of PM&R specializing in sports concussion rehab, musculoskeletal ultrasonography, and non-surgical spine biomechanics.',
            consultationFee: 115.0,
            experienceYears: 12,
            rating: 4.98,
            workingHours: [
                { weekday: 1, startTime: '09:00', endTime: '17:00' },
                { weekday: 3, startTime: '09:00', endTime: '17:00' },
                { weekday: 4, startTime: '09:00', endTime: '17:00' },
                { weekday: 5, startTime: '09:00', endTime: '17:00' }
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
