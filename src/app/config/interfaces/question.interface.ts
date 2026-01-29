export interface Question {
  id: number;
  text: string;
  answers: string[];
  correctAnswerIndex: number;
  hint: string;
  audio: string;
}
