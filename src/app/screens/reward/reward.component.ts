import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ScratchCardComponent } from '../../components/scratch-card/scratch-card.component';
import { GAME_CONFIG } from '../../config/game.config';
import { AudioService } from '../../services/audio.service';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-reward',
  standalone: true,
  imports: [CommonModule, ScratchCardComponent],
  templateUrl: './reward.component.html',
  styleUrl: './reward.component.scss'
})
export class RewardComponent implements OnInit {
  readonly ticketImage = GAME_CONFIG.images.ticket;
  readonly rewardTitle = GAME_CONFIG.ui.rewardTitle;
  readonly rewardMessage = GAME_CONFIG.ui.rewardMessage;
  readonly playAgainText = GAME_CONFIG.ui.playAgainText;

  isRevealed = false;
  showConfetti = false;

  constructor(
    private router: Router,
    private audioService: AudioService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    // Guard: redirect if game not complete
    if (!this.gameStateService.canAccessReward()) {
      this.router.navigate(['/']);
      return;
    }

    this.audioService.playReward();
  }

  onFullyRevealed(): void {
    this.isRevealed = true;
    this.showConfetti = true;
    this.audioService.playScratchComplete();
  }

  playAgain(): void {
    this.gameStateService.resetGame();
    this.router.navigate(['/']);
  }
}
