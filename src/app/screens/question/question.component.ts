import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AnswerButtonComponent, ButtonState } from '../../components/answer-button/answer-button.component';
import { Question } from '../../config/interfaces/question.interface';
import { AudioService } from '../../services/audio.service';
import { GameStateService } from '../../services/game-state.service';

interface AnswerState {
  text: string;
  state: ButtonState;
}

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, AnswerButtonComponent],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent implements OnInit, OnDestroy {
  question: Question | undefined;
  answerStates: AnswerState[] = [];
  showHint = false;
  isAnswered = false;
  questionNumber = 1;
  totalQuestions = 0;

  constructor(
    private route: ActivatedRoute,
    private audioService: AudioService,
    private gameStateService: GameStateService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.totalQuestions = this.gameStateService.totalQuestions;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = parseInt(params['id'], 10);
      this.loadQuestion(id);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.audioService.stop();
  }

  private loadQuestion(id: number): void {
    this.question = this.gameStateService.getQuestion(id);

    if (this.question) {
      // Calculate question number based on position in the questions array
      this.questionNumber = this.gameStateService.getQuestionIndex(id) + 1;
      this.answerStates = this.question.answers.map(text => ({
        text,
        state: 'default' as ButtonState
      }));
      this.showHint = false;
      this.isAnswered = false;
      this.audioService.playQuestion();
    }
  }

  selectAnswer(index: number): void {
    if (!this.question || this.isAnswered) return;

    const isCorrect = this.gameStateService.answerQuestion(this.question.id, index);

    // Update button state
    this.answerStates[index].state = isCorrect ? 'correct' : 'incorrect';

    if (isCorrect) {
      this.isAnswered = true;
      this.audioService.playCorrect();

      // Navigate to next after delay
      this.ngZone.run(() => {
        setTimeout(() => {
          this.gameStateService.navigateToNextQuestion(this.question!.id);
        }, 1500);
      });
    } else {
      this.audioService.playIncorrect();
      this.showHint = true;

      // Reset button state after animation
      setTimeout(() => {
        this.answerStates[index].state = 'default';
      }, 600);
    }
  }
}
