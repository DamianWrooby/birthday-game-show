import { Injectable, signal } from '@angular/core';
import { GAME_CONFIG } from '../config/game.config';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;
  private pendingAudio: string | null = null;
  private isUnlocked = signal(false);

  constructor() {
    this.setupUnlockListeners();
  }

  private setupUnlockListeners(): void {
    const unlock = () => {
      this.isUnlocked.set(true);
      if (this.pendingAudio) {
        this.playAudio(this.pendingAudio);
        this.pendingAudio = null;
      }
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };

    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
  }

  private playAudio(src: string): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    this.audio = new Audio(src);
    this.audio.play().catch((error) => {
      if (error.name === 'NotAllowedError') {
        this.pendingAudio = src;
      } else {
        console.warn('Audio playback failed:', error);
      }
    });
  }

  playWelcome(): void {
    this.playAudio(GAME_CONFIG.audio.welcome);
  }

  playWelcomeAndWait(): Promise<void> {
    return new Promise((resolve) => {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
      }

      this.audio = new Audio(GAME_CONFIG.audio.welcome);

      this.audio.addEventListener('ended', () => resolve(), { once: true });
      this.audio.addEventListener('error', () => resolve(), { once: true });

      this.audio.play().catch(() => {
        // If playback blocked, resolve immediately to allow navigation
        resolve();
      });
    });
  }

  playQuestion(audioPath?: string): void {
    this.playAudio(audioPath ?? GAME_CONFIG.audio.question);
  }

  playReward(): void {
    this.playAudio(GAME_CONFIG.audio.reward);
  }

  playCorrect(): void {
    this.playAudio(GAME_CONFIG.audio.correct);
  }

  playCorrectAndWait(): Promise<void> {
    return new Promise((resolve) => {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
      }

      this.audio = new Audio(GAME_CONFIG.audio.correct);

      this.audio.addEventListener('ended', () => resolve(), { once: true });
      this.audio.addEventListener('error', () => resolve(), { once: true });

      this.audio.play().catch(() => {
        resolve();
      });
    });
  }

  playIncorrect(): void {
    this.playAudio(GAME_CONFIG.audio.incorrect);
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }
}
