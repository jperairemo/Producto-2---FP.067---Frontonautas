import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media.component.html',
})
export class MediaComponent {
  private _player: Player | null = null;

  @ViewChild('videoEl') videoEl?: ElementRef<HTMLVideoElement>;

  @Input() set player(value: Player | null) {
    // Si cambia de jugador, paramos la reproducción anterior
    if (this._player?.id !== value?.id) {
      this.stop();
      this.playUrlSafe = null;
    }
    this._player = value;

    // Si no hay video, salimos
    const videoKey = value?.videoUrl;
    if (!videoKey) {
      this.playing = false;
      return;
    }

    // Convertimos a URL reproducible
    const url = this.buildPlayableUrl(videoKey);
    this.playUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  get player(): Player | null {
    return this._player;
  }

  playing = false;
  playUrlSafe: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  toggle() {
    const el = this.videoEl?.nativeElement;
    if (!this.playUrlSafe || !el) return;

    if (this.playing) {
      el.pause();
      this.playing = false;
    } else {
      el.play()
        .then(() => (this.playing = true))
        .catch(() => (this.playing = false));
    }
  }

  stop() {
    const el = this.videoEl?.nativeElement;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    this.playing = false;
  }

  onNativePlay() {
    this.playing = true;
  }

  onNativePause() {
    this.playing = false;
  }

  /**  Lógica mejorada para reproducir URLs o locales */
  private buildPlayableUrl(url: string): string {
    const key = url.trim();

    //  Si ya es una URL completa (YouTube, Drive, etc.)
    if (/^https?:\/\//i.test(key)) {
      if (key.includes('youtube.com') || key.includes('youtu.be')) {
        return this.toYoutubeEmbed(key); // transformar a embed
      }
      return key; // archivo directo (.mp4)
    }

    //  Si es un asset local (ruta relativa)
    if (key.startsWith('assets/')) {
      return key;
    }

    // Si es simplemente "video1" => usar assets
    return `assets/videos/${key}.mp4`;
  }

  /**  Convierte YouTube a formato EMBED compatible */
  private toYoutubeEmbed(url: string): string {
    let videoId = '';

    // Detectamos diferentes formatos:
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    }

    return `https://www.youtube.com/embed/${videoId}`;
  }
}
