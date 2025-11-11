import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../models/player.model';
import { PlayersService } from '../../services/players.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {
  @Input() player: Player | null = null;
  @Output() closed = new EventEmitter<void>();

  // modo edición
  editMode = false;
  editablePlayer: Player | null = null;

  // para guardar URLs nuevas tras la subida
  pendingUpdates: Partial<Player> = {};

  defaultAvatar = 'avatars/default.png';

  constructor(private playersService: PlayersService) {}

  // si falla la imagen, carga el avatar por defecto
  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = this.defaultAvatar;
  }

  // cerrar detalle
  close() {
    this.closed.emit();
  }

  // activar modo edición
  enableEdit() {
    if (!this.player) return;
    this.editablePlayer = { ...this.player }; // copia del jugador actual
    this.editMode = true;
  }

  // cancelar edición
  cancelEdit() {
    this.editMode = false;
    this.editablePlayer = null;
    this.pendingUpdates = {};
  }

  // guardar cambios (sin archivos)
  saveEdit() {
    if (!this.editablePlayer || !this.editablePlayer.id) return;

    const { id, ...restoDatos } = this.editablePlayer;

    this.playersService.updatePlayer(id, restoDatos)
      .then(() => {
        console.log(' Jugador actualizado correctamente');
        this.player = { ...this.editablePlayer! }; // actualiza la vista
        this.editMode = false;
        this.pendingUpdates = {};
      })
      .catch(err => console.error('❌ Error al actualizar jugador:', err));
  }

  //  Subir archivo (imagen o vídeo)
  onPick(event: Event, fileType: 'image' | 'video') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.player?.id) return;

    console.log(`Subiendo ${fileType}:`, file.name);

    this.playersService.uploadFile(this.player.id, file, fileType).subscribe({
      next: (url) => {
        if (fileType === 'image') {
          this.pendingUpdates.imagenUrl = url;
          alert(' Imagen subida correctamente');
        } else {
          this.pendingUpdates.videoUrl = url;
          alert(' Vídeo subido correctamente');
        }
      },
      error: (err) => alert('❌ Error al subir archivo: ' + err)
    });
  }

  //  Guardar cambios después de subir archivos (actualiza URLs)
  saveUploads() {
    if (!this.player?.id) return;
    this.playersService.updatePlayer(this.player.id, this.pendingUpdates)
      .then(() => {
        console.log('✅ URLs actualizadas correctamente');
        this.pendingUpdates = {};
      })
      .catch((err) => console.error('❌ Error al guardar URLs:', err));
  }
}
