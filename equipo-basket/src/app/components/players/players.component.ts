import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
  @Input() players: Player[] = [];
  @Input() activeId: number | null = null;
  @Output() selected = new EventEmitter<Player>();

  search = '';
  pos = '';
  positions: string[] = ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot']; // 🔹 definidas
  avatars: string[] = ['chico1.png', 'chico2.png', 'chico3.png', 'chico4.png', 'chico5.png'];
  videos: string[] = ['video1', 'video2', 'video3', 'video4', 'video5'];

  nuevoJugador: Player = {
    id: 0,
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
    this.buildPositions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['players']) this.buildPositions();
  }

  private buildPositions(): void {
    const posicionesDeLista = this.players?.length
      ? Array.from(new Set(this.players.map((p) => p.position)))
      : [];
    this.positions = Array.from(new Set([...this.positions, ...posicionesDeLista])).sort();
  }

  select(p: Player): void {
    this.selected.emit(p);
  }

  addPlayer() {
    const jugador = { ...this.nuevoJugador, id: Date.now() };
    this.playersService.addPlayer(jugador)
      .then(() => {
        console.log('✅ Jugador añadido:', jugador);
        this.nuevoJugador = {
          id: 0,
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
      .catch(err => console.error('❌ Error al añadir jugador:', err));
  }
}
