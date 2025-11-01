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

  defaultAvatar = 'avatars/default.png';

  constructor(private playersService: PlayersService) {}

  // si falla la imagen, carga el avatar por defecto
  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = this.defaultAvatar;
  }

  close() {
    this.closed.emit();
  }

  // activar modo edición
  enableEdit() {
    if (!this.player) return;
    this.editablePlayer = { ...this.player }; // copia del jugador
    this.editMode = true;
  }

  // cancelar edición
  cancelEdit() {
    this.editMode = false;
    this.editablePlayer = null;
  }

  // guardar cambios en Firebase
  saveEdit() {
    if (!this.editablePlayer || !this.editablePlayer.id) return;

    const { id, ...restoDatos } = this.editablePlayer;

    this.playersService.updatePlayer(id, restoDatos)
      .then(() => {
        console.log('Jugador actualizado correctamente');
        this.player = { ...this.editablePlayer! }; // actualiza la vista
        this.editMode = false;
      })
      .catch(err => console.error('Error al actualizar jugador:', err));
  }
}
