import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Film } from '../modeles/film';
import { Serie } from '../modeles/serie';
import { FiltresRecherche } from '../modeles/filtresRecherche';

// Structure d'un film stocké
interface FilmStocke {
  id: number;
  title: string;
  note: number;
  heures: number;
  minutes: number;
  poster_path: string;
  statut: 'en_cours' | 'termine' | 'a_voir';
  favori: boolean;
  type: 'film';
}

// Structure d'une série stockée
interface SerieStocke {
  id: number;
  title: string;
  note: number;
  saison: number;
  episode: number;
  poster_path: string;
  statut: 'en_cours' | 'termine' | 'a_voir';
  favori: boolean;
  type: 'serie';
}

type OeuvreStocke = FilmStocke | SerieStocke;

@Injectable({ providedIn: 'root' })
export class StockageFilmLocal {
  private STORAGE_KEY = 'mes_films_data';

  // Observables séparés pour films et séries
  private filmsSubject = new BehaviorSubject<Film[]>([]);
  films$ = this.filmsSubject.asObservable();

  private seriesSubject = new BehaviorSubject<Serie[]>([]);
  series$ = this.seriesSubject.asObservable();

  constructor() {
    this.notifierChangement();
  }

  // ─── ÉCRITURE ────────────────────────────────────────────────────────────────

  modifierFilm(film: Film, statut: string, estFavori: boolean, note: number = 0, heures: number = 0, minutes: number = 0) {
    const collection = this.lireCollection();
    const index = collection.findIndex(item => item.id === film.id && item.type === 'film');

    if (statut === 'non_vu' && !estFavori) {
      if (index > -1) collection.splice(index, 1);
    } else {
      const filmAStocke: FilmStocke = {
        id: film.id,
        title: film.titre,
        poster_path: film.urlImage,
        statut: statut as FilmStocke['statut'],
        favori: estFavori,
        note: note,
        heures: heures,
        minutes: minutes,
        type: 'film'
      };

      if (index > -1) collection[index] = filmAStocke;
      else collection.push(filmAStocke);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collection));
    this.notifierChangement();
  }

  modifierSerie(serie: Serie, statut: string, estFavori: boolean, note: number = 0, saison: number = 0, episode: number = 0) {
    const collection = this.lireCollection();
    const index = collection.findIndex(item => item.id === serie.id && item.type === 'serie');

    if (statut === 'non_vu' && !estFavori) {
      if (index > -1) collection.splice(index, 1);
    } else {
      const serieAStocke: SerieStocke = {
        id: serie.id,
        title: serie.titre,
        poster_path: serie.urlImage,
        statut: statut as SerieStocke['statut'],
        favori: estFavori,
        note: note,
        saison: saison,
        episode: episode,
        type: 'serie'
      };

      if (index > -1) collection[index] = serieAStocke;
      else collection.push(serieAStocke);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collection));
    this.notifierChangement();
  }

  // ─── LECTURE ─────────────────────────────────────────────────────────────────

  getFilmsParStatut(statut: 'en_cours' | 'termine' | 'a_voir'): Film[] {
    return this.lireCollection()
      .filter(item => item.type === 'film' && item.statut === statut)
      .map(item => new Film(item));
  }

  getSeriesParStatut(statut: 'en_cours' | 'termine' | 'a_voir'): Serie[] {
    return this.lireCollection()
      .filter(item => item.type === 'serie' && item.statut === statut)
      .map(item => new Serie(item));
  }

  getFilmsFavoris(): Film[] {
    return this.lireCollection()
      .filter(item => item.type === 'film' && item.favori)
      .map(item => new Film(item));
  }

  getSeriesFavoris(): Serie[] {
    return this.lireCollection()
      .filter(item => item.type === 'serie' && item.favori)
      .map(item => new Serie(item));
  }

  // Pour la compatibilité (retourne toutes les œuvres)
  getOeuvresParStatut(statut: 'en_cours' | 'termine' | 'a_voir'): (Film | Serie)[] {
    return this.lireCollection()
      .filter(item => item.statut === statut)
      .map(item => item.type === 'film' ? new Film(item) : new Serie(item));
  }

  getTousFilms(): Film[] {
    return this.lireCollection()
      .filter(item => item.type === 'film')
      .map(item => new Film(item));
  }

  getToutesSeries(): Serie[] {
    return this.lireCollection()
      .filter(item => item.type === 'serie')
      .map(item => new Serie(item));
  }

  // ─── LECTURE POUR LA RECHERCHE ─────────────────────────────────────────────────

  /** Retourne les films/séries filtrés et triés selon les filtres donnés */
  rechercherEnLocal(terme: string, filtres: FiltresRecherche): (Film | Serie)[] {
    let resultats = this.lireCollection();

    // Filtre par type
    if (filtres.type === 'films') {
      resultats = resultats.filter(item => item.type === 'film');
    } else if (filtres.type === 'series') {
      resultats = resultats.filter(item => item.type === 'serie');
    }

    // Filtre par statut
    if (filtres.statut !== 'tous') {
      resultats = resultats.filter(item => item.statut === filtres.statut);
    }

    // Filtre favoris
    if (filtres.favoris === 'favoris') {
      resultats = resultats.filter(item => item.favori);
    }

    // Filtre par terme de recherche
    if (terme && terme.trim()) {
      const termeLower = terme.toLowerCase();
      resultats = resultats.filter(item => item.title.toLowerCase().includes(termeLower));
    }

    // Tri
    return this.trierOeuvres(resultats, filtres.tri);
  }

  /** Trie les œuvres selon le critère choisi */
  private trierOeuvres(resultats: OeuvreStocke[], tri: FiltresRecherche['tri']): (Film | Serie)[] {
    const copie = [...resultats];
    switch (tri) {
      case 'titre_az':
        return copie.sort((a, b) => a.title.localeCompare(b.title))
          .map(item => item.type === 'film' ? new Film(item) : new Serie(item));
      case 'popularite':
        return copie.sort((a, b) => b.note - a.note)
          .map(item => item.type === 'film' ? new Film(item) : new Serie(item));
      default:
        return copie.map(item => item.type === 'film' ? new Film(item) : new Serie(item));
    }
  }

  // ─── PRIVÉ ───────────────────────────────────────────────────────────────────

  private lireCollection(): OeuvreStocke[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private notifierChangement() {
    const films = this.lireCollection()
      .filter(item => item.type === 'film')
      .map(item => new Film(item));
    this.filmsSubject.next(films);

    const series = this.lireCollection()
      .filter(item => item.type === 'serie')
      .map(item => new Serie(item));
    this.seriesSubject.next(series);
  }
}
