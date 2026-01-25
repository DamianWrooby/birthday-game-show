import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GAME_CONFIG } from '../../config/game.config';
import { AudioService } from '../../services/audio.service';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent implements OnInit {
  readonly config = GAME_CONFIG;
  readonly hostImage = GAME_CONFIG.images.host;
  readonly title = GAME_CONFIG.ui.welcomeTitle;
  readonly message = GAME_CONFIG.ui.welcomeMessage;
  readonly playButtonText = GAME_CONFIG.ui.playButtonText;

  constructor(
    private router: Router,
    private audioService: AudioService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    this.gameStateService.resetGame();
    this.audioService.playWelcome();
  }

  startGame(): void {
    const firstQuestion = GAME_CONFIG.questions[0];
    if (firstQuestion) {
      this.router.navigate(['/question', firstQuestion.id]);
    }
  }
}
