import { DoctorDTO } from '@pulsepoint/shared';

export const DEFAULT_PHYSICIANS: DoctorDTO[] = [
  {
    id: 'doc-cardio-1',
    name: 'Dr. Sarah Jenkins, MD',
    email: 'dr.sarah@pulsepoint.health',
    specialization: 'Cardiology',
    bio: 'Board-certified Cardiologist with 14+ years of expertise in cardiovascular interventions, lipidology, hypertension, coronary health, and preventive echocardiography from Johns Hopkins Medicine.',
    consultationFee: 1200,
    experienceYears: 14,
    rating: 4.98,
    slotDurationMinutes: 30,
    education: 'MD from Johns Hopkins School of Medicine • Cardiology Fellowship at Harvard Medical School / Brigham and Women’s Hospital',
    hospitalAffiliation: 'Johns Hopkins Cardiovascular Institute & PulsePoint Heart Center',
    languages: ['English', 'Hindi'],
    publicationsCount: 32,
    achievements: [
      'Castle Connolly Top Doctor in Cardiovascular Disease (2024 - 2026)',
      'American Heart Association Clinical Excellence Award Winner',
      'Lead Author on New England Journal of Medicine (NEJM) Lipid Trial',
      'Fellow of the American College of Cardiology (FACC)'
    ],
    certifications: [
      'American Board of Internal Medicine (Cardiovascular Disease)',
      'National Board of Echocardiography Certified (Level III)',
      'Advanced Cardiovascular Life Support (ACLS) Certified',
      'Nuclear Cardiology Board Certified (CBNC)'
    ],
    ratingBreakdown: {
      bedsideManner: 4.99,
      waitTime: 4.89,
      clinicalClarity: 4.97
    },
    workingHours: [
      { weekday: 1, startTime: '09:00', endTime: '17:00' },
      { weekday: 2, startTime: '09:00', endTime: '17:00' },
      { weekday: 3, startTime: '09:00', endTime: '17:00' },
      { weekday: 4, startTime: '09:00', endTime: '17:00' },
      { weekday: 5, startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    id: 'doc-neuro-1',
    name: 'Dr. Marcus Vance, MD',
    email: 'dr.marcus@pulsepoint.health',
    specialization: 'Neurology',
    bio: 'Specialist in migraine management, neuromuscular disorders, epilepsy, cluster headaches, and neuro-rehabilitation from Johns Hopkins University and Mayo Clinic.',
    consultationFee: 1400,
    experienceYears: 11,
    rating: 4.94,
    slotDurationMinutes: 30,
    education: 'MD from Columbia University Vagelos College of Physicians • Neurology Residency & Fellowship at Mayo Clinic',
    hospitalAffiliation: 'Mayo Clinic Neurosciences & PulsePoint Comprehensive Brain Institute',
    languages: ['English', 'German'],
    publicationsCount: 28,
    achievements: [
      'American Academy of Neurology Clinical Research Fellow',
      'Published in The Lancet Neurology & JAMA Neurology',
      'Pioneer in Non-Invasive Vagus Nerve Stimulation for Migraines',
      'Top Neurologist Honor Roll by Medical Leader Forum'
    ],
    certifications: [
      'American Board of Psychiatry and Neurology (ABPN)',
      'United Council for Neurologic Subspecialties (UCNS) - Headache Medicine',
      'Electrodiagnostic Medicine Certified (ABEM)'
    ],
    ratingBreakdown: {
      bedsideManner: 4.96,
      waitTime: 4.88,
      clinicalClarity: 4.95
    },
    workingHours: [
      { weekday: 1, startTime: '10:00', endTime: '18:00' },
      { weekday: 2, startTime: '10:00', endTime: '18:00' },
      { weekday: 3, startTime: '10:00', endTime: '18:00' },
      { weekday: 4, startTime: '10:00', endTime: '18:00' }
    ]
  },
  {
    id: 'doc-derma-1',
    name: 'Dr. Elena Rostova, MD',
    email: 'dr.elena@pulsepoint.health',
    specialization: 'Dermatology',
    bio: 'Clinical dermatologist focused on autoimmune skin conditions, acne scarring, eczema, psoriasis, skin cancer screening, and advanced digital dermoscopy.',
    consultationFee: 950,
    experienceYears: 8,
    rating: 4.93,
    slotDurationMinutes: 30,
    education: 'MD from Stanford University School of Medicine • Dermatology Residency at NYU Langone Health',
    hospitalAffiliation: 'NYU Langone Medical Center & PulsePoint Dermatology Pavilion',
    languages: ['English', 'Russian', 'French'],
    publicationsCount: 19,
    achievements: [
      'American Academy of Dermatology Young Investigator Laureate',
      'Keynote Speaker on Biologics in Severe Atopic Dermatitis',
      'Published in Journal of the American Academy of Dermatology (JAAD)'
    ],
    certifications: [
      'American Board of Dermatology (ABD)',
      'Fellow of the American Academy of Dermatology (FAAD)',
      'Dermatopathology Certified'
    ],
    ratingBreakdown: {
      bedsideManner: 4.95,
      waitTime: 4.91,
      clinicalClarity: 4.94
    },
    workingHours: [
      { weekday: 2, startTime: '09:00', endTime: '16:30' },
      { weekday: 3, startTime: '09:00', endTime: '16:30' },
      { weekday: 4, startTime: '09:00', endTime: '16:30' },
      { weekday: 5, startTime: '09:00', endTime: '16:30' }
    ]
  },
  {
    id: 'doc-ortho-1',
    name: 'Dr. David Chen, MD',
    email: 'dr.david@pulsepoint.health',
    specialization: 'Orthopedics',
    bio: 'Consultant Orthopedic Surgeon specializing in arthroscopic sports injuries, joint preservation, cartilage repair, knee/hip biomechanics, and robotic joint replacement.',
    consultationFee: 1100,
    experienceYears: 16,
    rating: 4.97,
    slotDurationMinutes: 30,
    education: 'MD from Yale School of Medicine • Orthopedic Surgery Residency at Hospital for Special Surgery (HSS), New York',
    hospitalAffiliation: 'Hospital for Special Surgery & PulsePoint Orthopedic Pavilion',
    languages: ['English', 'Mandarin'],
    publicationsCount: 41,
    achievements: [
      'Chief Orthopedic Consultant for Regional Athletic Teams',
      'Castle Connolly Top Orthopedic Surgeon (5 Consecutive Years)',
      'Over 3,500 Successful Arthroscopic Joint Reconstructions',
      'Published in The American Journal of Sports Medicine'
    ],
    certifications: [
      'American Board of Orthopaedic Surgery (ABOS)',
      'Subspecialty Certificate in Orthopaedic Sports Medicine',
      'Fellow of the American Academy of Orthopaedic Surgeons (FAAOS)'
    ],
    ratingBreakdown: {
      bedsideManner: 4.98,
      waitTime: 4.92,
      clinicalClarity: 4.96
    },
    workingHours: [
      { weekday: 1, startTime: '08:30', endTime: '16:30' },
      { weekday: 3, startTime: '08:30', endTime: '16:30' },
      { weekday: 5, startTime: '08:30', endTime: '16:30' }
    ]
  },
  {
    id: 'doc-peds-1',
    name: 'Dr. Ananya Sharma, MD',
    email: 'dr.ananya@pulsepoint.health',
    specialization: 'Pediatrics',
    bio: 'Compassionate pediatric specialist providing developmental milestone tracking, immunization schedules, newborn care, and adolescent wellness with holistic family care.',
    consultationFee: 850,
    experienceYears: 9,
    rating: 4.99,
    slotDurationMinutes: 30,
    education: 'MD from Duke University School of Medicine • Pediatric Residency at Children’s Hospital of Philadelphia (CHOP)',
    hospitalAffiliation: 'Children’s Hospital of Philadelphia & PulsePoint Pediatric Wing',
    languages: ['English', 'Hindi'],
    publicationsCount: 16,
    achievements: [
      'Excellence in Pediatric Outpatient Care Award (2025)',
      'Lead Investigator in Childhood Allergy Prevention Protocols',
      'American Academy of Pediatrics (AAP) Active Fellow'
    ],
    certifications: [
      'American Board of Pediatrics (ABP)',
      'Pediatric Advanced Life Support (PALS) Certified',
      'Neonatal Resuscitation Program (NRP) Certified'
    ],
    ratingBreakdown: {
      bedsideManner: 5.0,
      waitTime: 4.94,
      clinicalClarity: 4.98
    },
    workingHours: [
      { weekday: 1, startTime: '09:00', endTime: '17:00' },
      { weekday: 2, startTime: '09:00', endTime: '17:00' },
      { weekday: 3, startTime: '09:00', endTime: '17:00' },
      { weekday: 4, startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    id: 'doc-psych-1',
    name: 'Dr. Robert Hayes, MD',
    email: 'dr.robert@pulsepoint.health',
    specialization: 'Psychiatry',
    bio: 'Integrative psychiatrist specializing in mood disorders, adult ADHD, anxiety management, PTSD, and evidence-based psycho-pharmacology.',
    consultationFee: 1350,
    experienceYears: 13,
    rating: 4.94,
    slotDurationMinutes: 30,
    education: 'MD from University of Pennsylvania Perelman School of Medicine • Psychiatry Residency at Massachusetts General Hospital / Harvard Medical School',
    hospitalAffiliation: 'Massachusetts General Hospital & PulsePoint Mind Health Center',
    languages: ['English'],
    publicationsCount: 22,
    achievements: [
      'American Psychiatric Association Distinguished Fellow',
      'Published in American Journal of Psychiatry & Nature Mental Health',
      'Leader in Precision Biomarker-Guided Antidepressant Selection'
    ],
    certifications: [
      'American Board of Psychiatry and Neurology (ABPN)',
      'Subspecialty in Psychosomatic Medicine & Neuropsychiatry'
    ],
    ratingBreakdown: {
      bedsideManner: 4.97,
      waitTime: 4.92,
      clinicalClarity: 4.95
    },
    workingHours: [
      { weekday: 1, startTime: '11:00', endTime: '19:00' },
      { weekday: 2, startTime: '11:00', endTime: '19:00' },
      { weekday: 3, startTime: '11:00', endTime: '19:00' },
      { weekday: 4, startTime: '11:00', endTime: '19:00' }
    ]
  },
  {
    id: 'doc-endo-1',
    name: 'Dr. Fatima Al-Mansoor, MD',
    email: 'dr.fatima@pulsepoint.health',
    specialization: 'Endocrinology',
    bio: 'Leading Endocrinologist focused on complex diabetes management, thyroid dysfunctions, Hashimoto’s, adrenal disorders, hormonal imbalances, and metabolic wellness.',
    consultationFee: 1150,
    experienceYears: 12,
    rating: 4.92,
    slotDurationMinutes: 30,
    education: 'MD from Oxford University Medical Sciences • Endocrinology Fellowship at Cleveland Clinic',
    hospitalAffiliation: 'Cleveland Clinic Endocrinology Institute & PulsePoint Metabolic Wing',
    languages: ['English', 'Arabic'],
    publicationsCount: 27,
    achievements: [
      'Endocrine Society Global Innovator in Continuous Glucose Monitoring',
      'Published in The Journal of Clinical Endocrinology & Metabolism (JCEM)',
      'Keynote Presenter at the World Diabetes Congress'
    ],
    certifications: [
      'American Board of Internal Medicine (Endocrinology, Diabetes & Metabolism)',
      'Endocrine Certification in Neck Ultrasound (ECNU)'
    ],
    ratingBreakdown: {
      bedsideManner: 4.96,
      waitTime: 4.89,
      clinicalClarity: 4.94
    },
    workingHours: [
      { weekday: 1, startTime: '09:00', endTime: '16:00' },
      { weekday: 2, startTime: '09:00', endTime: '16:00' },
      { weekday: 4, startTime: '09:00', endTime: '16:00' },
      { weekday: 5, startTime: '09:00', endTime: '16:00' }
    ]
  },
  {
    id: 'doc-ophtha-1',
    name: 'Dr. James Wilson, MD',
    email: 'dr.james@pulsepoint.health',
    specialization: 'Ophthalmology',
    bio: 'Ophthalmic microsurgeon with deep expertise in corneal topography, glaucoma diagnostics, diabetic retinopathy, and laser vision restoration.',
    consultationFee: 1250,
    experienceYears: 15,
    rating: 4.96,
    slotDurationMinutes: 30,
    education: 'MD from UCLA David Geffen School of Medicine • Ophthalmology Residency at Wilmer Eye Institute, Johns Hopkins',
    hospitalAffiliation: 'Wilmer Eye Institute & PulsePoint Vision Surgery Center',
    languages: ['English', 'Spanish'],
    publicationsCount: 35,
    achievements: [
      'Over 5,000 Precision Micro-Incision Laser Procedures Performed',
      'American Academy of Ophthalmology Honor Award',
      'Pioneer in Next-Gen Glaucoma Drainage Implants'
    ],
    certifications: [
      'American Board of Ophthalmology (ABO)',
      'Fellow of the American College of Surgeons (FACS)'
    ],
    ratingBreakdown: {
      bedsideManner: 4.98,
      waitTime: 4.91,
      clinicalClarity: 4.97
    },
    workingHours: [
      { weekday: 2, startTime: '08:30', endTime: '16:30' },
      { weekday: 3, startTime: '08:30', endTime: '16:30' },
      { weekday: 4, startTime: '08:30', endTime: '16:30' }
    ]
  },
  {
    id: 'doc-gyn-1',
    name: 'Dr. Emily Watson, MD',
    email: 'dr.emily@pulsepoint.health',
    specialization: 'Gynecology',
    bio: 'Attending Ob-Gyn specializing in reproductive endocrinology, prenatal maternal care, PCOS, endometriosis, and minimally invasive pelvic laparoscopic surgery.',
    consultationFee: 1300,
    experienceYears: 10,
    rating: 4.98,
    slotDurationMinutes: 30,
    education: 'MD from Northwestern University Feinberg School of Medicine • Ob-Gyn Residency at UCSF Medical Center',
    hospitalAffiliation: 'UCSF Women’s Health Pavilion & PulsePoint Maternal Health',
    languages: ['English', 'French'],
    publicationsCount: 21,
    achievements: [
      'Award for Humanism and Excellence in Women’s Healthcare',
      'Featured in Contemporary OB/GYN Journal',
      'Fellow of the American College of Obstetricians and Gynecologists (FACOG)'
    ],
    certifications: [
      'American Board of Obstetrics and Gynecology (ABOG)',
      'Minimally Invasive Gynecologic Surgery (MIGS) Certified'
    ],
    ratingBreakdown: {
      bedsideManner: 4.99,
      waitTime: 4.93,
      clinicalClarity: 4.97
    },
    workingHours: [
      { weekday: 1, startTime: '09:30', endTime: '17:30' },
      { weekday: 2, startTime: '09:30', endTime: '17:30' },
      { weekday: 3, startTime: '09:30', endTime: '17:30' },
      { weekday: 5, startTime: '09:30', endTime: '16:00' }
    ]
  },
  {
    id: 'doc-gastro-1',
    name: 'Dr. Liam O\'Connor, MD',
    email: 'dr.liam@pulsepoint.health',
    specialization: 'Gastroenterology',
    bio: 'Gastroenterologist and Hepatologist specializing in irritable bowel syndrome (IBS), GERD, Crohn’s, liver pathology, and advanced therapeutic endoscopy.',
    consultationFee: 1100,
    experienceYears: 14,
    rating: 4.91,
    slotDurationMinutes: 30,
    education: 'MD from Trinity College Dublin • Gastroenterology Fellowship at Mount Sinai Hospital, New York',
    hospitalAffiliation: 'Mount Sinai Gastroenterology & PulsePoint Digestive Wellness',
    languages: ['English', 'Gaeilge'],
    publicationsCount: 30,
    achievements: [
      'American Gastroenterological Association (AGA) Fellow',
      'Published in Gastroenterology & Gut Journal',
      'Pioneer in Gut Microbiome Precision Therapy'
    ],
    certifications: [
      'American Board of Internal Medicine (Gastroenterology)',
      'Advanced Endoscopy & ERCP Certified'
    ],
    ratingBreakdown: {
      bedsideManner: 4.94,
      waitTime: 4.87,
      clinicalClarity: 4.93
    },
    workingHours: [
      { weekday: 1, startTime: '08:00', endTime: '16:00' },
      { weekday: 3, startTime: '08:00', endTime: '16:00' },
      { weekday: 4, startTime: '08:00', endTime: '16:00' }
    ]
  },
  {
    id: 'doc-onco-1',
    name: 'Dr. Samantha Brooks, MD',
    email: 'dr.samantha@pulsepoint.health',
    specialization: 'Oncology',
    bio: 'Hematologist-Oncologist specializing in precision molecular therapies, immunotherapy protocols, targeted cancer treatments, and genetic tumor profiling.',
    consultationFee: 1600,
    experienceYears: 17,
    rating: 4.99,
    slotDurationMinutes: 30,
    education: 'MD from Harvard Medical School • Medical Oncology Fellowship at Dana-Farber Cancer Institute',
    hospitalAffiliation: 'Dana-Farber Cancer Institute & PulsePoint Comprehensive Oncology',
    languages: ['English', 'Spanish'],
    publicationsCount: 48,
    achievements: [
      'National Cancer Institute (NCI) Principal Investigator',
      'Published in The New England Journal of Medicine (NEJM) & Science Translational Medicine',
      'American Society of Clinical Oncology (ASCO) Keynote Speaker'
    ],
    certifications: [
      'American Board of Internal Medicine (Medical Oncology & Hematology)',
      'Genomic Precision Oncology Certified'
    ],
    ratingBreakdown: {
      bedsideManner: 5.0,
      waitTime: 4.95,
      clinicalClarity: 4.99
    },
    workingHours: [
      { weekday: 2, startTime: '09:00', endTime: '17:00' },
      { weekday: 3, startTime: '09:00', endTime: '17:00' },
      { weekday: 4, startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    id: 'doc-ent-1',
    name: 'Dr. Kenji Tanaka, MD',
    email: 'dr.kenji@pulsepoint.health',
    specialization: 'ENT (Otolaryngology)',
    bio: 'ENT surgeon with sub-specialization in chronic sinusitis, allergic rhinitis, vestibular balance disorders, hearing restoration, and vocal cord micro-surgery.',
    consultationFee: 1050,
    experienceYears: 11,
    rating: 4.93,
    slotDurationMinutes: 30,
    education: 'MD from University of Tokyo Medical School • Otolaryngology Residency at University of Washington Medical Center',
    hospitalAffiliation: 'UW Medical Center & PulsePoint Ear, Nose & Throat Institute',
    languages: ['English', 'Japanese'],
    publicationsCount: 23,
    achievements: [
      'American Academy of Otolaryngology - Head and Neck Surgery Star Reviewer',
      'Published in The Laryngoscope',
      'Over 2,000 Endoscopic Sinus Surgeries Completed with 99.4% Success'
    ],
    certifications: [
      'American Board of Otolaryngology - Head and Neck Surgery (ABOHNS)',
      'Subspecialty in Rhinology & Endoscopic Skull Base Surgery'
    ],
    ratingBreakdown: {
      bedsideManner: 4.95,
      waitTime: 4.91,
      clinicalClarity: 4.94
    },
    workingHours: [
      { weekday: 1, startTime: '09:00', endTime: '17:00' },
      { weekday: 2, startTime: '09:00', endTime: '17:00' },
      { weekday: 4, startTime: '09:00', endTime: '17:00' },
      { weekday: 5, startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    id: 'doc-pulm-1',
    name: 'Dr. Arthur Pendelton, MD',
    email: 'dr.arthur@pulsepoint.health',
    specialization: 'Pulmonology',
    bio: 'Pulmonologist and Critical Care specialist from Harvard Medical School focused on advanced asthma, COPD, interstitial lung disease, and obstructive sleep apnea.',
    consultationFee: 1200,
    experienceYears: 15,
    rating: 4.96,
    slotDurationMinutes: 30,
    education: 'MD from Harvard Medical School • Pulmonary & Critical Care Fellowship at Beth Israel Deaconess Medical Center',
    hospitalAffiliation: 'Beth Israel Deaconess & PulsePoint Respiratory Care Wing',
    languages: ['English'],
    publicationsCount: 36,
    achievements: [
      'American College of Chest Physicians (CHEST) Master Fellow',
      'Published in American Journal of Respiratory and Critical Care Medicine (AJRCCM)',
      'National Leader in Interventional Bronchoscopy Protocols'
    ],
    certifications: [
      'American Board of Internal Medicine (Pulmonary Disease & Critical Care Medicine)',
      'American Board of Sleep Medicine Certified'
    ],
    ratingBreakdown: {
      bedsideManner: 4.98,
      waitTime: 4.92,
      clinicalClarity: 4.97
    },
    workingHours: [
      { weekday: 1, startTime: '08:30', endTime: '16:30' },
      { weekday: 2, startTime: '08:30', endTime: '16:30' },
      { weekday: 3, startTime: '08:30', endTime: '16:30' }
    ]
  },
  {
    id: 'doc-rheum-1',
    name: 'Dr. Meera Nambiar, MD',
    email: 'dr.meera@pulsepoint.health',
    specialization: 'Rheumatology',
    bio: 'Stanford-trained clinical rheumatologist specializing in autoimmune pathologies, rheumatoid arthritis, lupus nephritis, psoriatic arthritis, and biologics therapy.',
    consultationFee: 1300,
    experienceYears: 13,
    rating: 4.94,
    slotDurationMinutes: 30,
    education: 'MD from Stanford University School of Medicine • Rheumatology Fellowship at Stanford Health Care',
    hospitalAffiliation: 'Stanford Health Care & PulsePoint Autoimmune Center',
    languages: ['English', 'Malayalam', 'Tamil', 'Hindi'],
    publicationsCount: 26,
    achievements: [
      'American College of Rheumatology (ACR) Distinguished Fellow',
      'Published in Arthritis & Rheumatology Journal',
      'Principal Investigator in Novel Targeted JAK Inhibitor Clinical Trials'
    ],
    certifications: [
      'American Board of Internal Medicine (Rheumatology)',
      'RhMSUS (Musculoskeletal Ultrasound Certification in Rheumatology)'
    ],
    ratingBreakdown: {
      bedsideManner: 4.97,
      waitTime: 4.89,
      clinicalClarity: 4.96
    },
    workingHours: [
      { weekday: 1, startTime: '09:00', endTime: '17:00' },
      { weekday: 3, startTime: '09:00', endTime: '17:00' },
      { weekday: 4, startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    id: 'doc-uro-1',
    name: 'Dr. Julian Rivera, MD',
    email: 'dr.julian@pulsepoint.health',
    specialization: 'Urology',
    bio: 'Mayo Clinic fellowship-trained Urological Surgeon specializing in minimally invasive laparoscopic surgery, kidney stone removal, and prostate health.',
    consultationFee: 1250,
    experienceYears: 14,
    rating: 4.92,
    slotDurationMinutes: 30,
    education: 'MD from Baylor College of Medicine • Urology Residency & Robotic Fellowship at Mayo Clinic',
    hospitalAffiliation: 'Mayo Clinic Surgical Center & PulsePoint Urology Pavilion',
    languages: ['English', 'Spanish'],
    publicationsCount: 29,
    achievements: [
      'Over 2,800 Robot-Assisted Laparoscopic Procedures Conducted',
      'American Urological Association (AUA) Active Member',
      'Published in The Journal of Urology'
    ],
    certifications: [
      'American Board of Urology (ABU)',
      'Fellow of the American College of Surgeons (FACS)'
    ],
    ratingBreakdown: {
      bedsideManner: 4.95,
      waitTime: 4.89,
      clinicalClarity: 4.93
    },
    workingHours: [
      { weekday: 2, startTime: '09:00', endTime: '17:00' },
      { weekday: 3, startTime: '09:00', endTime: '17:00' },
      { weekday: 4, startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    id: 'doc-allergy-1',
    name: 'Dr. Rachel Goldstein, MD',
    email: 'dr.rachel@pulsepoint.health',
    specialization: 'Allergy & Immunology',
    bio: 'Johns Hopkins Pediatric & Adult Allergist specializing in environmental immunotherapies, severe anaphylaxis, food allergies, drug allergies, and chronic urticaria.',
    consultationFee: 1000,
    experienceYears: 10,
    rating: 4.97,
    slotDurationMinutes: 30,
    education: 'MD from Johns Hopkins University School of Medicine • Allergy/Immunology Fellowship at National Institute of Allergy and Infectious Diseases (NIAID)',
    hospitalAffiliation: 'Johns Hopkins Allergy & Asthma Center & PulsePoint Immunology Clinic',
    languages: ['English', 'Hebrew'],
    publicationsCount: 20,
    achievements: [
      'American Academy of Allergy, Asthma & Immunology (AAAAI) Fellow',
      'Published in Journal of Allergy and Clinical Immunology (JACI)',
      'Lead Researcher in Sublingual Oral Peanut Desensitization'
    ],
    certifications: [
      'American Board of Allergy and Immunology (ABAI)',
      'Pediatric Advanced Life Support (PALS) Certified'
    ],
    ratingBreakdown: {
      bedsideManner: 4.98,
      waitTime: 4.93,
      clinicalClarity: 4.97
    },
    workingHours: [
      { weekday: 1, startTime: '09:00', endTime: '17:00' },
      { weekday: 2, startTime: '09:00', endTime: '17:00' },
      { weekday: 3, startTime: '09:00', endTime: '17:00' },
      { weekday: 4, startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    id: 'doc-nephro-1',
    name: 'Dr. Tariq Al-Hassan, MD',
    email: 'dr.tariq@pulsepoint.health',
    specialization: 'Nephrology',
    bio: 'Cleveland Clinic Consultant Nephrologist expert in glomerular diseases, renal preservation, electrolyte disorders, hypertension management, and transplant follow-up.',
    consultationFee: 1350,
    experienceYears: 16,
    rating: 4.95,
    slotDurationMinutes: 30,
    education: 'MD from King’s College London • Nephrology Fellowship at Cleveland Clinic Glickman Urological & Kidney Institute',
    hospitalAffiliation: 'Cleveland Clinic Kidney Center & PulsePoint Renal Health',
    languages: ['English', 'Arabic'],
    publicationsCount: 37,
    achievements: [
      'American Society of Nephrology (ASN) Distinguished Educator',
      'Published in Journal of the American Society of Nephrology (JASN)',
      'Pioneer in Early-Stage Diabetic Nephropathy Arrest Protocols'
    ],
    certifications: [
      'American Board of Internal Medicine (Nephrology)',
      'American Society of Hypertension Certified Clinical Specialist'
    ],
    ratingBreakdown: {
      bedsideManner: 4.97,
      waitTime: 4.91,
      clinicalClarity: 4.96
    },
    workingHours: [
      { weekday: 1, startTime: '08:00', endTime: '16:00' },
      { weekday: 2, startTime: '08:00', endTime: '16:00' },
      { weekday: 4, startTime: '08:00', endTime: '16:00' }
    ]
  },
  {
    id: 'doc-pmr-1',
    name: 'Dr. Chloe Desjardins, MD',
    email: 'dr.chloe@pulsepoint.health',
    specialization: 'Physical Medicine & Rehab',
    bio: 'Physiatrist specializing in musculoskeletal spine disorders, sports biomechanics, neurological stroke recovery, myofascial pain, and interventional ultrasound-guided injections.',
    consultationFee: 1100,
    experienceYears: 9,
    rating: 4.96,
    slotDurationMinutes: 30,
    education: 'MD from McGill University Faculty of Medicine • PM&R Residency at Spaulding Rehabilitation Hospital / Harvard Medical School',
    hospitalAffiliation: 'Spaulding Rehabilitation Hospital & PulsePoint Sports Spine Center',
    languages: ['English', 'French'],
    publicationsCount: 18,
    achievements: [
      'American Academy of Physical Medicine and Rehabilitation (AAPM&R) Member',
      'Published in PM&R Journal & Archives of Physical Medicine and Rehabilitation',
      'Team Physician for International Winter Athletics Competitions'
    ],
    certifications: [
      'American Board of Physical Medicine and Rehabilitation (ABPMR)',
      'Subspecialty in Sports Medicine & Electrodiagnostic Medicine'
    ],
    ratingBreakdown: {
      bedsideManner: 4.99,
      waitTime: 4.94,
      clinicalClarity: 4.97
    },
    workingHours: [
      { weekday: 1, startTime: '09:00', endTime: '17:00' },
      { weekday: 2, startTime: '09:00', endTime: '17:00' },
      { weekday: 3, startTime: '09:00', endTime: '17:00' },
      { weekday: 5, startTime: '09:00', endTime: '15:00' }
    ]
  }
];
