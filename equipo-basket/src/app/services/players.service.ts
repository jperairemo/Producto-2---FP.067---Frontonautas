import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  CollectionReference,
  DocumentData,
  QuerySnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({ providedIn: 'root' })
export class PlayersService {
  private firestore = inject(Firestore);

  constructor() {}

  // Obtener jugadores en tiempo real
  getPlayers(): Observable<Player[]> {
    const playersRef: CollectionReference<DocumentData> = collection(this.firestore, 'players');

    return new Observable<Player[]>((observer) => {
      const unsubscribe = onSnapshot(playersRef, (snapshot: QuerySnapshot<DocumentData>) => {
        const players: Player[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Player;
          const { id, ...rest } = data;
          return { id: docSnap.id, ...rest };
        });
        observer.next(players);
      });

      return () => unsubscribe();
    });
  }

  // Añadir jugador
  addPlayer(player: Player) {
    const playersRef = collection(this.firestore, 'players');
    return addDoc(playersRef, player);
  }

  // Borrar jugador
  deletePlayer(id: string) {
    const docRef = doc(this.firestore, `players/${id}`);
    return deleteDoc(docRef);
  }

  // Actualizar jugador
  updatePlayer(id: string, data: Partial<Player>) {
    const docRef = doc(this.firestore, `players/${id}`);
    return updateDoc(docRef, data);
  }
}
