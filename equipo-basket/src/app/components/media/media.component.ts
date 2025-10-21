
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

  @ViewChild('videoEl') videoEl?: ElementRef<HTMLVideoElement>; // TODO

  @Input() set player(value: Player | null) {
    // Si cambia de jugador, paramos la reproducción anterior
    if (this._player?.id !== value?.id) {
      this.stop();
      this.playUrlSafe = null; // Esto hace que se resetee la url
    }
    this._player = value;

    // Si no hay video para el nuevo jugador, salimos
    const videoKey = value?.videoUrl;
    if (!videoKey) {
      this.playing = false;
      return;
    }

    // Construir y asignar la nueva URL de reproducción
    const url = this.buildPlayableUrl(videoKey);
    this.playUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  get player(): Player | null {
    return this._player;
  }

  playing = false;
  playUrlSafe: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

//  Play/Pause usando el <video> nativo
  toggle() {
    const el = this.videoEl?.nativeElement;
    if (!this.playUrlSafe || !el) return;

    if (this.playing) {
      el.pause();
      this.playing = false;
    } else {
      el.play()
        .then(() => (this.playing = true))
        .catch(() => (this.playing = false)); // por si el navegador bloquea
    }
  }
  

  // NUEVA FUNCION STOP
  stop() {
    const el = this.videoEl?.nativeElement;
    if (el) {
      el.pause();
      el.currentTime = 0; // vuelve al inicio
    }
    this.playing = false;

  
  }

  onNativePlay() {
    this.playing = true;
  }
  onNativePause() {
    this.playing = false;
  }

  // Normaliza a /embed/, usa dominio nocookie y añade autoplay
  private buildPlayableUrl(url: string): string {
    const key = url.trim(); // 'video1' | 'video2' | 'video3' o una ruta ya armada

    // Si llega una URL completa o una ruta a assets
    if (/^https?:\/\//i.test(key) || key.startsWith('assets/')) {
      return key;
    }

    // Si te llega 'video1'/'video2'/'video3', construimos la ruta en assets
    return `assets/videos/${key}.mp4`;
  }
}
