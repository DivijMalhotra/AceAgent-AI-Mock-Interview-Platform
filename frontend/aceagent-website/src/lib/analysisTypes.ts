/** Full analysis response from GET /interview/{id}/analysis */
export interface AnalysisData {
  session_id: string;
  topic: string;
  difficulty: string;
  total_questions: number;
  total_answers: number;
  overall_score: number;
  confidence_score: number;
  communication_score: number;
  emotion_analysis: EmotionAnalysis;
  speech_metrics: SpeechMetrics;
  content_analysis: ContentAnalysis;
  gesture_analysis: GestureAnalysis;
  feedback: string[];
  question_wise_analysis: QuestionWiseAnalysis[];
  transcripts: TranscriptEntry[];
  created_at: string;
}

export interface EmotionAnalysis {
  confidence: number;
  nervousness: number;
  engagement: number;
}

export interface SpeechMetrics {
  filler_words: number;
  speech_rate: number;
  clarity_score: number;
}

export interface ContentAnalysis {
  relevance_score: number;
  keyword_match: string[];
}

export interface GestureAnalysis {
  eye_contact: number;
  posture: number;
}

export interface QuestionWiseAnalysis {
  question: string;
  score: number;
  feedback: string;
  transcript: string;
  strengths: string[];
  weaknesses: string[];
}

export interface TranscriptEntry {
  question: string;
  answer: string;
  timestamp: string;
}
