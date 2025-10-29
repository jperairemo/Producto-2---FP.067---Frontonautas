import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Player } from '../models/player.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayersService {
  private firestore = inject(Firestore);
  private playersCollection = collection(this.firestore, 'players');

  // 🔹 Añadir jugador
  addPlayer(player: Player) {
    return addDoc(this.playersCollection, player);
  }

  // 🔹 Escuchar cambios en tiempo real
  getPlayers(): Observable<Player[]> {
    return collectionData(this.playersCollection, { idField: 'docId' }) as Observable<Player[]>;
  }
}
