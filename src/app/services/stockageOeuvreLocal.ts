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
  vote_average: number;
  heures: number;
  minutes: number;
  dureeTotale?: number;
  poster_path: string;
  statut: 'en_cours' | 'termine' | 'a_voir';
  favori: boolean;
  type: 'film';
  overview?: string;
  release_date?: string;
}

interface SerieStocke {
  id: number;
  title: string;
  note: number;
  vote_average: number;
  saison: number;
  episode: number;
  nbSaisonsTotal?: number;
  nbEpisodesTotal?: number;
  poster_path: string;
  statut: 'en_cours' | 'termine' | 'a_voir';
  favori: boolean;
  type: 'serie';
  overview?: string;
  first_air_date?: string;
}

type OeuvreStocke = FilmStocke | SerieStocke;

@Injectable({ providedIn: 'root' })
export class StockageOeuvreLocal {
  private STORAGE_KEY = 'mes_films_data';

  private filmsSubject = new BehaviorSubject<Film[]>([]);
  films$ = this.filmsSubject.asObservable();

  private seriesSubject = new BehaviorSubject<Serie[]>([]);
  series$ = this.seriesSubject.asObservable();

  constructor() {
    this.notifierChangement();
  }


  modifierFilm(film: Film, statut: string, estFavori: boolean, note: number = 0, heures: number = 0, minutes: number = 0) {
    const collection = this.lireCollection();
    const index = collection.findIndex(item => item.id === film.id && item.type === 'film');

    if (statut === 'non_vu' && !estFavori) {
      if (index > -1) collection.splice(index, 1);
    } else {
      const existing = index > -1 ? collection[index] as FilmStocke : null;
      const filmAStocke: FilmStocke = {
        id: film.id,
        title: film.titre,
        vote_average: film.note,
        poster_path: film.urlImage,
        statut: statut as FilmStocke['statut'],
        favori: estFavori,
        note: note,
        heures: heures,
        minutes: minutes,
        dureeTotale: existing?.dureeTotale || (film as any).dureeTotale || 0,
        type: 'film',
        overview: film.apercu,
        release_date: film.dateSortie
      };

      if (index > -1) collection[index] = filmAStocke;
      else collection.push(filmAStocke);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collection));
    this.notifierChangement();
  }

  modifierFilmAvecTotal(film: Film, statut: string, estFavori: boolean, note: number, heures: number, minutes: number, dureeTotale: number) {
    const collection = this.lireCollection();
    const index = collection.findIndex(item => item.id === film.id && item.type === 'film');

    const filmAStocke: FilmStocke = {
      id: film.id,
      title: film.titre,
      vote_average: film.note,
      poster_path: film.urlImage,
      statut: statut as FilmStocke['statut'],
      favori: estFavori,
      note: note,
      heures: heures,
      minutes: minutes,
      dureeTotale: dureeTotale,
      type: 'film',
      overview: film.apercu,
      release_date: film.dateSortie
    };

    if (index > -1) collection[index] = filmAStocke;
    else collection.push(filmAStocke);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collection));
    this.notifierChangement();
  }

  modifierSerie(serie: Serie, statut: string, estFavori: boolean, note: number = 0, saison: number = 0, episode: number = 0) {
    const collection = this.lireCollection();
    const index = collection.findIndex(item => item.id === serie.id && item.type === 'serie');

    if (statut === 'non_vu' && !estFavori) {
      if (index > -1) collection.splice(index, 1);
    } else {
      const existing = index > -1 ? collection[index] as SerieStocke : null;
      const serieAStocke: SerieStocke = {
        id: serie.id,
        title: serie.titre,
        vote_average: serie.note,
        poster_path: serie.urlImage,
        statut: statut as SerieStocke['statut'],
        favori: estFavori,
        note: note,
        saison: saison,
        episode: episode,
        nbSaisonsTotal: existing?.nbSaisonsTotal || (serie as any).nbSaisonsTotal || 0,
        nbEpisodesTotal: existing?.nbEpisodesTotal || (serie as any).nbEpisodesTotal || 0,
        type: 'serie',
        overview: serie.apercu,
        first_air_date: serie.dateSortie,
      };

      if (index > -1) collection[index] = serieAStocke;
      else collection.push(serieAStocke);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collection));
    this.notifierChangement();
  }

  modifierSerieAvecTotal(serie: Serie, statut: string, estFavori: boolean, note: number, saison: number, episode: number, nbSaisonsTotal: number, nbEpisodesTotal: number) {
    const collection = this.lireCollection();
    const index = collection.findIndex(item => item.id === serie.id && item.type === 'serie');

    const serieAStocke: SerieStocke = {
      id: serie.id,
      title: serie.titre,
      vote_average: serie.note,
      poster_path: serie.urlImage,
      statut: statut as SerieStocke['statut'],
      favori: estFavori,
      note: note,
      saison: saison,
      episode: episode,
      nbSaisonsTotal: nbSaisonsTotal,
      nbEpisodesTotal: nbEpisodesTotal,
      type: 'serie',
      overview: serie.apercu,
      first_air_date: serie.dateSortie,
    };

    if (index > -1) collection[index] = serieAStocke;
    else collection.push(serieAStocke);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collection));
    this.notifierChangement();
  }


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


  rechercherEnLocal(terme: string, filtres: FiltresRecherche): (Film | Serie)[] {
    let resultats = this.lireCollection();

    if (filtres.type === 'films') {
      resultats = resultats.filter(item => item.type === 'film');
    } else if (filtres.type === 'series') {
      resultats = resultats.filter(item => item.type === 'serie');
    }

    if (filtres.statut !== 'tous') {
      resultats = resultats.filter(item => item.statut === filtres.statut);
    }

    if (filtres.favoris === 'favoris') {
      resultats = resultats.filter(item => item.favori);
    }

    if (terme && terme.trim()) {
      const termeLower = terme.toLowerCase();
      resultats = resultats.filter(item => item.title.toLowerCase().includes(termeLower));
    }

    return this.trierOeuvres(resultats, filtres.tri);
  }

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
