import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from './models/player.model';
import { PlayersComponent } from './components/players/players.component';
import { DetailComponent } from './components/detail/detail.component';
import { MediaComponent } from './components/media/media.component';
import { PlayersService } from './services/players.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PlayersComponent, DetailComponent, MediaComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  players$: Observable<Player[]> | undefined;
  selectedPlayer: Player | null = null;
  title = 'EQUIPO BASKET';

  constructor(private playersService: PlayersService) {}

 ngOnInit(): void {
    this.players$ = this.playersService.getPlayers();

    // Este log es CLAVE para saber si llegan datos
    this.players$.subscribe(players => {
      console.log('Jugadores recibidos desde Firestore:', players);
    });
  }
  onSelect(p: Player) {
    this.selectedPlayer = p;
  }

  onCloseDetail() {
    this.selectedPlayer = null;
  }
}
