import { Injectable, signal } from '@angular/core';
import { GAME_CONFIG } from '../config/game.config';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private currentSource: AudioBufferSourceNode | null = null;
  private pendingAudio: string | null = null;
  private isUnlocked = signal(false);

  // Fallback for browsers without Web Audio API
  private fallbackAudio: HTMLAudioElement | null = null;

  constructor() {
    this.setupUnlockListeners();
    this.preloadAllAudio();
  }

  private setupUnlockListeners(): void {
    const unlock = async () => {
      // Resume AudioContext on user gesture (required for iOS)
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

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

  private async preloadAllAudio(): Promise<void> {
    // Initialize AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.audioContext = new AudioContextClass();
    }

    // Preload all audio files
    const audioFiles = [
      GAME_CONFIG.audio.welcome,
      GAME_CONFIG.audio.reward,
      GAME_CONFIG.audio.correct,
      GAME_CONFIG.audio.incorrect,
      GAME_CONFIG.audio.scratchComplete,
      ...GAME_CONFIG.questions.map(q => q.audio).filter((a): a is string => !!a)
    ];

    for (const src of audioFiles) {
      this.loadAudioBuffer(src);
    }
  }

  private async loadAudioBuffer(src: string): Promise<void> {
    if (!this.audioContext || this.audioBuffers.has(src)) return;

    try {
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(src, audioBuffer);
    } catch (error) {
      console.warn('Failed to preload audio:', src, error);
    }
  }

  private playAudio(src: string): void {
    // Stop any currently playing audio
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch {
        // Ignore if already stopped
      }
      this.currentSource = null;
    }

    // Try Web Audio API first (works reliably on iOS after unlock)
    if (this.audioContext && this.audioBuffers.has(src)) {
      // Ensure context is running
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const buffer = this.audioBuffers.get(src)!;
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start(0);
      this.currentSource = source;
      return;
    }

    // Fallback to HTMLAudioElement
    if (this.fallbackAudio) {
      this.fallbackAudio.pause();
      this.fallbackAudio.currentTime = 0;
    }

    this.fallbackAudio = new Audio(src);
    this.fallbackAudio.play().catch((error) => {
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
    return this.playAudioAndWait(GAME_CONFIG.audio.welcome);
  }

  private playAudioAndWait(src: string): Promise<void> {
    return new Promise((resolve) => {
      // Stop any currently playing audio
      if (this.currentSource) {
        try {
          this.currentSource.stop();
        } catch {
          // Ignore if already stopped
        }
        this.currentSource = null;
      }

      // Try Web Audio API first
      if (this.audioContext && this.audioBuffers.has(src)) {
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }

        const buffer = this.audioBuffers.get(src)!;
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.onended = () => resolve();
        source.start(0);
        this.currentSource = source;
        return;
      }

      // Fallback to HTMLAudioElement
      if (this.fallbackAudio) {
        this.fallbackAudio.pause();
        this.fallbackAudio.currentTime = 0;
      }

      this.fallbackAudio = new Audio(src);
      this.fallbackAudio.addEventListener('ended', () => resolve(), { once: true });
      this.fallbackAudio.addEventListener('error', () => resolve(), { once: true });

      this.fallbackAudio.play().catch(() => {
        resolve();
      });
    });
  }

  playQuestion(audioPath: string): void {
    this.playAudio(audioPath);
  }

  playReward(): void {
    this.playAudio(GAME_CONFIG.audio.reward);
  }

  playCorrect(): void {
    this.playAudio(GAME_CONFIG.audio.correct);
  }

  playCorrectAndWait(): Promise<void> {
    return this.playAudioAndWait(GAME_CONFIG.audio.correct);
  }

  playIncorrect(): void {
    this.playAudio(GAME_CONFIG.audio.incorrect);
  }

  playScratchComplete(): void {
    this.playAudio(GAME_CONFIG.audio.scratchComplete);
  }

  stop(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch {
        // Ignore if already stopped
      }
      this.currentSource = null;
    }

    if (this.fallbackAudio) {
      this.fallbackAudio.pause();
      this.fallbackAudio.currentTime = 0;
    }
  }
}
