import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonState = 'default' | 'selected' | 'correct' | 'incorrect';

@Component({
  selector: 'app-answer-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-button.component.html',
  styleUrl: './answer-button.component.scss'
})
export class AnswerButtonComponent {
  @Input() text = '';
  @Input() state: ButtonState = 'default';
  @Input() disabled = false;
  @Input() animationDelay = 0;
  @Input() letter = '';

  @Output() selected = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && this.state === 'default') {
      this.selected.emit();
    }
  }
}
