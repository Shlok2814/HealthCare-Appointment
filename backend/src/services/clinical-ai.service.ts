import { TriageUrgency, AIAnalysisStatus, PrescriptionItem, MedicationScheduleEntry } from '@pulsepoint/shared';

export interface SymptomTriageResult {
  urgencyLevel: TriageUrgency;
  primaryConcern: string;
  suggestedDoctorQuestions: string[];
  rawAIOutput?: string;
  status: AIAnalysisStatus;
}

export interface PostVisitSummaryResult {
  careInstructions: string;
  medicationSchedule: MedicationScheduleEntry[];
  followUpRecommendations: string[];
  status: AIStatusString;
}

type AIStatusString = 'SUCCESS' | 'FALLBACK' | 'FAILED';

export class ClinicalAIService {
  /**
   * Evaluates patient-described symptoms to assess clinical urgency level,
   * extracts the primary clinical concern, and generates tailored diagnostic probing questions.
   */
  static async triageSymptoms(symptomsText: string): Promise<SymptomTriageResult> {
    const text = symptomsText.toLowerCase();

    // High urgency emergency signals
    const emergencyKeywords = [
      'chest pain', 'shortness of breath', 'difficulty breathing', 'unconscious',
      'stroke', 'slurred speech', 'paralysis', 'severe bleeding', 'seizure',
      'loss of vision', 'heart attack', 'suicidal'
    ];

    // Moderate urgency signals
    const urgentKeywords = [
      'high fever', 'vomiting blood', 'fracture', 'severe burn', 'acute pain',
      'asthma attack', 'dehydration', 'fainting', 'rapid heart rate', 'infection'
    ];

    // Routine signals
    const moderateKeywords = [
      'fever', 'cough', 'sore throat', 'rash', 'back pain', 'joint pain',
      'migraine', 'headache', 'stomach ache', 'allergy', 'ear pain'
    ];

    let urgencyLevel = TriageUrgency.ROUTINE;
    let primaryConcern = 'General Consultation';
    const suggestedDoctorQuestions: string[] = [];

    if (emergencyKeywords.some(kw => text.includes(kw))) {
      urgencyLevel = TriageUrgency.EMERGENCY;
      primaryConcern = 'Potential Acute / High-Risk Episode requiring immediate triage';
      suggestedDoctorQuestions.push(
        'Are symptoms radiating to the left arm, neck, or back?',
        'When exactly did the acute onset begin, and is it worsening at rest?',
        'Are there accompanying diaphoresis, dizziness, or cyanosis?'
      );
    } else if (urgentKeywords.some(kw => text.includes(kw))) {
      urgencyLevel = TriageUrgency.URGENT;
      primaryConcern = 'Acute Symptom Flare requiring prompt clinical intervention';
      suggestedDoctorQuestions.push(
        'Have you measured your body temperature or blood oxygen levels today?',
        'How frequently are these episodes occurring per hour?',
        'Are you able to keep down oral fluids and medications?'
      );
    } else if (moderateKeywords.some(kw => text.includes(kw))) {
      urgencyLevel = TriageUrgency.MODERATE;
      primaryConcern = 'Sub-acute Symptom Management & Evaluation';
      suggestedDoctorQuestions.push(
        'How many days have you been experiencing these specific symptoms?',
        'Have over-the-counter medications provided any relief?',
        'Do you have any pre-existing chronic conditions or known drug allergies?'
      );
    } else {
      urgencyLevel = TriageUrgency.ROUTINE;
      primaryConcern = 'Routine Health Assessment & Primary Care Consultation';
      suggestedDoctorQuestions.push(
        'What is the primary goal or outcome you are hoping for from today\'s visit?',
        'Have there been any recent lifestyle, dietary, or environmental changes?',
        'Are you currently taking any daily supplements or prescription drugs?'
      );
    }

    return {
      urgencyLevel,
      primaryConcern,
      suggestedDoctorQuestions,
      rawAIOutput: `Clinical rule-engine analyzed symptom payload: "${symptomsText.slice(0, 100)}..."`,
      status: AIAnalysisStatus.SUCCESS
    };
  }

  /**
   * Generates patient-accessible care summaries and structured medication schedule
   * from clinical doctor notes and prescription data.
   */
  static generatePatientSummary(
    diagnosis: string,
    clinicalNotes: string,
    prescriptions: PrescriptionItem[]
  ): PostVisitSummaryResult {
    const careInstructions = `You were evaluated for ${diagnosis}. Based on the clinical review: ${clinicalNotes}. Please strictly adhere to the prescribed dosages and ensure ample rest and hydration.`;

    const medicationSchedule: MedicationScheduleEntry[] = prescriptions.map(rx => ({
      medicine: rx.medicationName,
      dosage: rx.dosage,
      frequency: rx.frequency,
      durationDays: rx.durationDays,
      instructions: rx.instructions || 'Take with water after meals as directed.'
    }));

    const followUpRecommendations: string[] = [
      `Monitor your response to treatment over the next ${prescriptions.length > 0 ? prescriptions[0].durationDays : 5} days.`,
      'If you develop any unexpected adverse reactions or fever spikes, contact the clinic immediately.',
      'Schedule a follow-up review if symptoms persist beyond the prescribed course.'
    ];

    return {
      careInstructions,
      medicationSchedule,
      followUpRecommendations,
      status: 'SUCCESS'
    };
  }
}
