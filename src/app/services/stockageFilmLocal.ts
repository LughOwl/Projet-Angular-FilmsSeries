import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UnFilm } from '../modeles/unFilm';
import { FiltresRecherche } from '../modeles/filtresRecherche';

// Structure d'un film tel qu'il est sauvegardé dans le localStorage
interface FilmStocke {
  id: number;
  title: string;
  poster_path: string;
  statut: 'en_cours' | 'termine' | 'a_voir';
  favori: boolean;
}

@Injectable({ providedIn: 'root' })
export class StockageFilmLocal {
  private STORAGE_KEY = 'mes_films_data';

  // Observable : les composants s'y abonnent pour être notifiés des changements
  private filmsSubject = new BehaviorSubject<UnFilm[]>([]);
  films$ = this.filmsSubject.asObservable();

  constructor() {
    this.notifierChangement();
  }

  // ─── ÉCRITURE ────────────────────────────────────────────────────────────────

  /**
   * Ajoute ou met à jour un film dans le stockage local.
   * Si statut = 'non_vu' et pas favori → on supprime le film du stockage.
   */
  modifierFilm(film: UnFilm, statut: string, estFavori: boolean) {
    const collection = this.lireCollection();
    const index = collection.findIndex(item => item.id === film.id);

    if (statut === 'non_vu' && !estFavori) {
      // Plus de statut ni favori → on retire le film
      if (index > -1) collection.splice(index, 1);
    } else {
      const filmAStocke: FilmStocke = {
        id: film.id,
        title: film.titre,
        poster_path: film.urlImage,
        statut: statut as FilmStocke['statut'],
        favori: estFavori
      };
      if (index > -1) collection[index] = filmAStocke;
      else collection.push(filmAStocke);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collection));
    this.notifierChangement();
  }

  // ─── LECTURE ─────────────────────────────────────────────────────────────────

  /** Retourne les films filtrés et triés selon les filtres donnés */
  rechercherEnLocal(terme: string, filtres: FiltresRecherche): UnFilm[] {
    let resultats = this.lireCollection().map(f => new UnFilm(f));

    // Filtre par statut
    if (filtres.statut !== 'tous') {
      resultats = resultats.filter(f => f.statut === filtres.statut);
    }

    // Filtre favoris
    if (filtres.favoris === 'favoris') {
      resultats = resultats.filter(f => f.estFavori);
    }

    // Filtre par type
    if (filtres.type === 'films') {
      resultats = resultats.filter(f => f.type === 'film');
    } else if (filtres.type === 'series') {
      resultats = resultats.filter(f => f.type === 'serie');
    }

    // Filtre par terme de recherche
    if (terme && terme.trim()) {
      const termeLower = terme.toLowerCase();
      resultats = resultats.filter(f => f.titre.toLowerCase().includes(termeLower));
    }

    // Tri
    return this.trier(resultats, filtres.tri);
  }

  /** Films par statut (pour la page Films) */
  getFilmsParStatut(statut: 'en_cours' | 'termine' | 'a_voir'): UnFilm[] {
    return this.lireCollection()
      .filter(f => f.statut === statut)
      .map(f => new UnFilm(f));
  }

  /** Films favoris (pour la page Films) */
  getFavoris(): UnFilm[] {
    return this.lireCollection()
      .filter(f => f.favori)
      .map(f => new UnFilm(f));
  }

  // ─── TRI ─────────────────────────────────────────────────────────────────────

  trier(resultats: UnFilm[], tri: FiltresRecherche['tri']): UnFilm[] {
    const copie = [...resultats];
    switch (tri) {
      case 'titre_az':
        return copie.sort((a, b) => a.titre.localeCompare(b.titre));
      case 'popularite':
        return copie.sort((a, b) => b.note - a.note);
      default:
        return copie;
    }
  }

  // ─── PRIVÉ ───────────────────────────────────────────────────────────────────

  /** Lit la collection brute depuis le localStorage */
  private lireCollection(): FilmStocke[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /** Notifie les abonnés que les données ont changé */
  private notifierChangement() {
    const films = this.lireCollection().map(f => new UnFilm(f));
    this.filmsSubject.next(films);
  }
}
