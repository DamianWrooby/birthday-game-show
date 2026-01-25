import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scratch-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scratch-card.component.html',
  styleUrl: './scratch-card.component.scss'
})
export class ScratchCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scratchCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() revealImage = '';
  @Input() overlayColor = '#c0c0c0';
  @Input() brushSize = 40;
  @Input() revealThreshold = 90;

  @Output() fullyRevealed = new EventEmitter<void>();

  private ctx: CanvasRenderingContext2D | null = null;
  private isDrawing = false;
  private hasRevealed = false;
  private canvasWidth = 320;
  private canvasHeight = 200;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    if (!this.ctx) return;

    // Set canvas size
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;

    // Fill with overlay color
    this.ctx.fillStyle = this.overlayColor;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add scratch pattern/texture
    this.addScratchTexture();

    // Setup event listeners
    this.setupEventListeners();
  }

  private addScratchTexture(): void {
    if (!this.ctx) return;

    // Add subtle pattern to make it look scratchable
    this.ctx.fillStyle = '#d0d0d0';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * this.canvasWidth;
      const y = Math.random() * this.canvasHeight;
      this.ctx.fillRect(x, y, 2, 2);
    }

    // Add "Scratch Here!" text
    this.ctx.fillStyle = '#888';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('✨ Zdrap tutaj! ✨', this.canvasWidth / 2, this.canvasHeight / 2);
  }

  private setupEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;

    // Touch events
    canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    canvas.addEventListener('touchend', this.handleEnd.bind(this));

    // Mouse events for desktop testing
    canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.handleEnd.bind(this));
    canvas.addEventListener('mouseleave', this.handleEnd.bind(this));
  }

  private removeEventListeners(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    canvas.removeEventListener('touchend', this.handleEnd.bind(this));
    canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    canvas.removeEventListener('mouseup', this.handleEnd.bind(this));
    canvas.removeEventListener('mouseleave', this.handleEnd.bind(this));
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    this.isDrawing = true;
    const touch = e.touches[0];
    this.scratch(touch.clientX, touch.clientY);
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    if (!this.isDrawing) return;
    const touch = e.touches[0];
    this.scratch(touch.clientX, touch.clientY);
  }

  private handleMouseDown(e: MouseEvent): void {
    this.isDrawing = true;
    this.scratch(e.clientX, e.clientY);
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.isDrawing) return;
    this.scratch(e.clientX, e.clientY);
  }

  private handleEnd(): void {
    this.isDrawing = false;
    this.checkRevealPercentage();
  }

  private scratch(clientX: number, clientY: number): void {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private checkRevealPercentage(): void {
    if (this.hasRevealed || !this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const revealPercentage = (transparentPixels / totalPixels) * 100;

    if (revealPercentage >= this.revealThreshold) {
      this.hasRevealed = true;
      this.fullyRevealed.emit();
      this.revealAll();
    }
  }

  private revealAll(): void {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
