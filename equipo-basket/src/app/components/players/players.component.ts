import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Player } from '../../models/player.model';
import { PlayersFilterPipe } from '../../pipes/players-filter.pipe';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayersFilterPipe],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css',
})
export class PlayersComponent implements OnInit, OnChanges {
  // Inputs que está pasando AppComponent 
  @Input() players: Player[] = [];
  @Input() activeId: number | null = null;

  // Output para notificar selección al padre 
  @Output() selected = new EventEmitter<Player>();

  // Filtros 
  search = '';
  pos = '';
  positions: string[] = [];

  ngOnInit(): void {
    this.buildPositions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['players']) this.buildPositions();
  }

  private buildPositions(): void {
    this.positions = this.players?.length
      ? Array.from(new Set(this.players.map((p) => p.position))).sort()
      : [];
  }

  // Método que espera template (click)="select(p)"
  select(p: Player): void {
    this.selected.emit(p);
  }
}
