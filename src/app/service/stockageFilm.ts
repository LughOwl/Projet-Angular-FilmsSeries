import { Injectable } from '@angular/core';
import { UnFilm } from '../bdd/unFilm';
import {BehaviorSubject} from "rxjs";

@Injectable({ providedIn: 'root' })
export class StockageFilm {
  private STORAGE_KEY = 'mes_films_data';

  private filmsSuivants = new BehaviorSubject<any[]>(this.getTouteLaCollection());
  films$ = this.filmsSuivants.asObservable();
  // Sauvegarder ou mettre à jour un film
  modifierFilm(film: UnFilm, statut: string, estFavori: boolean) {
    let collection = this.getTouteLaCollection();

    // On cherche si le film existe déjà dans notre stockage local via l'ID
    const index = collection.findIndex(item => item.id === film.id);

    if (statut === 'non_vu' && !estFavori) {
      if (index > -1) collection.splice(index, 1);
    } else {
      const filmData = {
        id: film.id,
        title: film.titre,
        poster_path: film.urlImage,
        statut: statut,
        favori: estFavori
        // ajoute les autres champs si nécessaire
      };
      if (index > -1) collection[index] = filmData;
      else collection.push(filmData);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collection));
    // ON DIFFUSE LA NOUVELLE LISTE IMMÉDIATEMENT
    this.filmsSuivants.next(collection);
  }

  private getTouteLaCollection(): any[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Récupérer les films pour la page "Films"
  getFilmsParStatut(statut: string): UnFilm[] {
    return this.getTouteLaCollection()
      .filter(item => item.statut === statut)
      .map(item => new UnFilm(item)); // On recrée des objets UnFilm
  }

  getFavoris(): UnFilm[] {
    return this.getTouteLaCollection()
      .filter(item => item.favori === true)
      .map(item => new UnFilm(item));
  }
}
