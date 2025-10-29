import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLAYERS } from './data/players';
import { Player } from './models/player.model';

import { PlayersComponent } from './components/players/players.component';
import { DetailComponent } from './components/detail/detail.component';
import { MediaComponent } from './components/media/media.component';
import { PlayersService } from './services/players.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PlayersComponent, DetailComponent, MediaComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  players: Player[] = PLAYERS;
  selectedPlayer: Player | null = this.players[0] ?? null;
  title: any;

  constructor(private playersService: PlayersService) {}

  onSelect(p: Player) {
    this.selectedPlayer = p;
  }

  onCloseDetail() {
    this.selectedPlayer = null;
  }
}
