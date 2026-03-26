import { Injectable } from '@angular/core';
import { UnFilm } from '../modeles/unFilm';
import {BehaviorSubject} from "rxjs";

@Injectable({ providedIn: 'root' })
export class StockageFilmLocal {
  private STORAGE_KEY = 'mes_films_data';

  listeFavoris: UnFilm[] = [];
  listeEnCours: UnFilm[] = [];
  listeTermine: UnFilm[] = [];
  listeAVoir: UnFilm[] = [];

  private filmsSubject = new BehaviorSubject<{
    favoris: UnFilm[],
    enCours: UnFilm[],
    termine: UnFilm[],
    aVoir: UnFilm[]
  }>({ favoris: [], enCours: [], termine: [], aVoir: [] });

  films$ = this.filmsSubject.asObservable();

  constructor() {
    this.rafraichirListes();
  }

  modifierFilm(film: UnFilm, statut: string, estFavori: boolean) {
    let collection = this.getTouteLaCollection();

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
      };
      if (index > -1) collection[index] = filmData;
      else collection.push(filmData);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collection));
    this.rafraichirListes();
  }

  private rafraichirListes() {
    const collection = this.getTouteLaCollection();

    this.listeFavoris = collection.filter(f => f.favori).map(f => new UnFilm(f));
    this.listeEnCours = collection.filter(f => f.statut === 'en_cours').map(f => new UnFilm(f));
    this.listeTermine = collection.filter(f => f.statut === 'termine').map(f => new UnFilm(f));
    this.listeAVoir = collection.filter(f => f.statut === 'a_voir').map(f => new UnFilm(f));

    this.filmsSubject.next({
      favoris: this.listeFavoris,
      enCours: this.listeEnCours,
      termine: this.listeTermine,
      aVoir: this.listeAVoir
    });
  }
  private getTouteLaCollection(): any[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Récupérer les films pour la page "Films"
  getFilmsParStatut(statut: string): UnFilm[] {
    return this.getTouteLaCollection()
      .filter(film => film.statut === statut)
      .map(film => new UnFilm(film)); // On recrée des objets UnFilm
  }

  getFavoris(): UnFilm[] {
    return this.getTouteLaCollection()
      .filter(film => film.favori)
      .map(film => new UnFilm(film));
  }
}
