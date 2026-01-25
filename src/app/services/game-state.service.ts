import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GAME_CONFIG } from '../config/game.config';
import { Question } from '../config/interfaces/question.interface';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private answeredQuestions = signal<Set<number>>(new Set());

  readonly totalQuestions = GAME_CONFIG.questions.length;
  readonly currentProgress = computed(() => this.answeredQuestions().size);
  readonly isGameComplete = computed(() => this.answeredQuestions().size >= this.totalQuestions);

  constructor(private router: Router) {}

  getQuestion(id: number): Question | undefined {
    return GAME_CONFIG.questions.find(q => q.id === id);
  }

  getQuestionByIndex(index: number): Question | undefined {
    return GAME_CONFIG.questions[index];
  }

  getQuestionIndex(id: number): number {
    return GAME_CONFIG.questions.findIndex(q => q.id === id);
  }

  answerQuestion(questionId: number, answerIndex: number): boolean {
    const question = this.getQuestion(questionId);
    if (!question) return false;

    const isCorrect = question.correctAnswerIndex === answerIndex;

    if (isCorrect) {
      this.answeredQuestions.update(set => {
        const newSet = new Set(set);
        newSet.add(questionId);
        return newSet;
      });
    }

    return isCorrect;
  }

  isQuestionAnswered(questionId: number): boolean {
    return this.answeredQuestions().has(questionId);
  }

  navigateToNextQuestion(currentQuestionId: number): void {
    const currentIndex = GAME_CONFIG.questions.findIndex(q => q.id === currentQuestionId);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= GAME_CONFIG.questions.length) {
      this.router.navigate(['/reward']);
    } else {
      const nextQuestion = GAME_CONFIG.questions[nextIndex];
      this.router.navigate(['/question', nextQuestion.id]);
    }
  }

  resetGame(): void {
    this.answeredQuestions.set(new Set());
  }

  canAccessReward(): boolean {
    return this.isGameComplete();
  }
}
