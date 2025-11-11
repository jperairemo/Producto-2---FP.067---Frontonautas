import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../models/player.model';
import { PlayersFilterPipe } from '../../pipes/players-filter.pipe';
import { PlayersService } from '../../services/players.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayersFilterPipe],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css',
})
export class PlayersComponent implements OnInit, OnChanges {
  /** lista que viene del padre (app.component) ya suscrito a Firebase */
  @Input() players: Player[] = [];
  /** id del jugador seleccionado (para marcarlo activo) */
  @Input() activeId: string | null = null;
  /** evento para decirle al padre qué jugador hemos hecho click */
  @Output() selected = new EventEmitter<Player>();

  // filtros
  search = '';
  pos = '';

  // para el select de posiciones
  positions: string[] = ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot'];

  // datos auxiliares para el formulario
  avatars: string[] = ['chico1.png', 'chico2.png', 'chico3.png', 'chico4.png', 'chico5.png'];
  videos: string[] = ['video1', 'video2', 'video3', 'video4', 'video5'];

  // modelo del formulario de alta
  nuevoJugador: Player = {
    id: '',
    firstName: '',
    lastName: '',
    position: '',
    age: 0,
    height: 0,
    avatar: 'avatars/chico1.png',
    videoUrl: 'video1',
    mediaTitle: ''
  };

  constructor(private playersService: PlayersService) {}

  ngOnInit(): void {
    this.rellenarPosicionesConLasQueVenganDeFirebase();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['players']) {
      this.rellenarPosicionesConLasQueVenganDeFirebase();
    }
  }

  /** esto es por si en Firebase habéis metido posiciones distintas a las 5 del array */
  private rellenarPosicionesConLasQueVenganDeFirebase() {
    if (!this.players || this.players.length === 0) return;
    const posFirebase = Array.from(new Set(this.players.map(p => p.position).filter(Boolean)));
    this.positions = Array.from(new Set([...this.positions, ...posFirebase])).sort();
  }

  /** cuando clicas en un jugador del listado */
  select(p: Player) {
    this.selected.emit(p);
  }

  /** alta de jugador → llama al servicio de Firebase */
  addPlayer() {
    // Firebase crea su propio id (string), pero vuestro modelo pide uno.
    // Le ponemos uno provisional. Luego en la lectura lo sobreescribe.
    const jugadorAGuardar: Player = {
      ...this.nuevoJugador,
      id: Date.now().toString()
    };

    this.playersService.addPlayer(jugadorAGuardar)
      .then(() => {
        console.log('Jugador añadido');
        // reseteamos el formulario
        this.nuevoJugador = {
          id: '',
          firstName: '',
          lastName: '',
          position: '',
          age: 0,
          height: 0,
          avatar: 'avatars/chico1.png',
          videoUrl: 'video1',
          mediaTitle: ''
        };
      })
      .catch(err => console.error('Error al añadir jugador:', err));
  }

  /** aquí es donde engancha el botón de la papelera del HTML */
  deletePlayer(player: Player, event: MouseEvent) {
    // evita que se dispare (click)="select(p)" del <li>
    event.stopPropagation();

    const ok = confirm(`¿Quieres borrar a ${player.firstName} ${player.lastName}?`);
    if (!ok) return;

    // ojo: en Firebase el id es string
    this.playersService.deletePlayer(player.id)
      .then(() => console.log('Jugador borrado:', player.id))
      .catch(err => console.error('Error al borrar jugador:', err));
  }
}
