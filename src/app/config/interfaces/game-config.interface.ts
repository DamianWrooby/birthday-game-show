import { Question } from './question.interface';

export interface AudioConfig {
  welcome: string;
  question: string;
  reward: string;
  correct: string;
  incorrect: string;
  scratchComplete: string;
}

export interface ImageConfig {
  host: string;
  ticket: string;
  scratchOverlay: string;
}

export interface GameConfig {
  questions: Question[];
  audio: AudioConfig;
  images: ImageConfig;
  ui: {
    welcomeTitle: string;
    welcomeMessage: string;
    playButtonText: string;
    rewardTitle: string;
    rewardMessage: string;
    playAgainText: string;
  };
}
