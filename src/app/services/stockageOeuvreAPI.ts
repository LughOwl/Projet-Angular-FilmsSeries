import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Film } from '../modeles/film';
import { Serie } from '../modeles/serie';
import { FiltresRecherche, ResultatRecherche } from '../modeles/filtresRecherche';

// Structure brute d'une page renvoyée par TMDB
interface UnePage {
  page: number;
  total_pages: number;
  total_results: number;
  results: any[];
}

@Injectable({ providedIn: 'root' })
export class StockageOeuvreAPI {
  private readonly cleApi = 'b0e3bb5a46ad602897aba592b2967fe2';
  private readonly urlBase = 'https://api.themoviedb.org/3';
  private httpClient = inject(HttpClient);

  public listeFilms: Film[] = [];
  public listeSeries: Serie[] = [];
  public listeFilmsAVenir: Film[] = [];
  public listeSeriesAVenir: Serie[] = [];

  public chargementFilms: boolean = false;
  public chargementSeries: boolean = false;
  public chargementFilmsAVenir: boolean = false;
  public chargementSeriesAVenir: boolean = false;

  public obtenirBandeAnnonce(idFilm: number): Observable<string | null> {
    const url = `${this.urlBase}/movie/${idFilm}/videos?api_key=${this.cleApi}&language=fr-FR`;

    return this.httpClient.get<any>(url).pipe(
      map(res => {
        const video = res.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

        return video ? `https://www.youtube.com/watch?v=${video.key}` : null;
      })
    );
  }

  rechercherSurAPI(terme: string, filtres: FiltresRecherche, page: number = 1): Observable<ResultatRecherche> {
    const url = this.construireURL(terme, filtres.type, page);

    return this.httpClient.get<UnePage>(url).pipe(
      map(reponse => {
        let resultats = reponse.results.map(item => new Film(item));

        resultats = this.trier(resultats, filtres.tri);

        return {
          resultats,
          total: reponse.total_results,
          page: reponse.page,
          totalPages: reponse.total_pages
        };
      })
    );
  }


  getFilmsPopulaires(): Observable<Film[]> {
    this.chargementFilms = true;
    const url = `${this.urlBase}/movie/popular?api_key=${this.cleApi}&language=fr-FR`;
    return this.httpClient.get<UnePage>(url).pipe(
      map(reponse => {
        const films = reponse.results.map(item => new Film(item));
        this.listeFilms = films;
        this.chargementFilms = false;
        return films;
      })
    );
  }

  getSeriesPopulaires(): Observable<Serie[]> {
    this.chargementSeries = true;
    const url = `${this.urlBase}/tv/popular?api_key=${this.cleApi}&language=fr-FR`;
    return this.httpClient.get<UnePage>(url).pipe(
      map(reponse => {
        const series = reponse.results.map(item => new Serie(item));
        this.listeSeries = series;
        this.chargementSeries = false;
        return series;
      })
    );
  }

  getFilmsAVenir(): Observable<Film[]> {
    this.chargementFilmsAVenir = true;
    const url = `${this.urlBase}/movie/upcoming?api_key=${this.cleApi}&language=fr-FR&region=FR`;
    return this.httpClient.get<UnePage>(url).pipe(
      map(reponse => {
        const films = reponse.results.map(item => new Film(item));
        this.listeFilmsAVenir = films;
        this.chargementFilmsAVenir = false;
        return films;
      })
    );
  }

  getSeriesAVenir(): Observable<Serie[]> {
    this.chargementSeriesAVenir = true;
    const url = `${this.urlBase}/tv/airing_today?api_key=${this.cleApi}&language=fr-FR`;
    return this.httpClient.get<UnePage>(url).pipe(
      map(reponse => {
        const series = reponse.results.map(item => new Serie(item));
        this.listeSeriesAVenir = series;
        this.chargementSeriesAVenir = false;
        return series;
      })
    );
  }

  getFilmDetails(id: number): Observable<any> {
    const url = `${this.urlBase}/movie/${id}?api_key=${this.cleApi}&language=fr-FR&append_to_response=credits`;
    return this.httpClient.get<any>(url);
  }

  getSerieDetails(id: number): Observable<any> {
    const url = `${this.urlBase}/tv/${id}?api_key=${this.cleApi}&language=fr-FR&append_to_response=credits`;
    return this.httpClient.get<any>(url);
  }

  trier(resultats: Film[], tri: FiltresRecherche['tri']): Film[] {
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

  private construireURL(terme: string, type: FiltresRecherche['type'], page: number): string {
    let endpoint: string;

    if (terme && terme.trim()) {
      if (type === 'films') endpoint = 'search/movie';
      else if (type === 'series') endpoint = 'search/tv';
      else endpoint = 'search/multi';
    } else {
      if (type === 'films') endpoint = 'movie/popular';
      else if (type === 'series') endpoint = 'tv/popular';
      else endpoint = 'movie/popular';
    }

    let url = `${this.urlBase}/${endpoint}?api_key=${this.cleApi}&language=fr-FR&page=${page}`;

    if (terme && terme.trim()) {
      url += `&query=${encodeURIComponent(terme)}`;
    }

    return url;
  }
}
