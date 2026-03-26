import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnFilm } from './unFilm';

// Interface pour une page de résultats
export interface UnePage {
  page: number;
  total_pages: number;
  total_results: number;
  results: any[];
}

@Injectable({
  providedIn: 'root',
})
export class Bddfilms {
  // Clé API TMDB
  private readonly cleApi = 'b0e3bb5a46ad602897aba592b2967fe2';
  private readonly urlBase = 'https://api.themoviedb.org/3';

  constructor(private httpClient: HttpClient) {}

  /**
   * Récupère les films populaires
   */
  public getFilmsPopulaires(): Observable<UnFilm[]> {
    const url = `${this.urlBase}/movie/popular?api_key=${this.cleApi}&language=fr-FR`;
    return this.importerFilms(url);
  }

  public getFilmsAVenir(): Observable<UnFilm[]> {
    const url = `${this.urlBase}/movie/upcoming?api_key=${this.cleApi}&language=fr-FR&region=FR`;
    return this.importerFilms(url);
  }
  /**
   * Récupère les séries populaires
   */
  public getSeriesPopulaires(): Observable<UnFilm[]> {
    const url = `${this.urlBase}/tv/popular?api_key=${this.cleApi}&language=fr-FR`;
    return this.importerFilms(url);
  }

  /**
   * Recherche des films par mot-clé
   */
  public rechercherFilms(terme: string): Observable<UnFilm[]> {
    const url = `${this.urlBase}/search/movie?api_key=${this.cleApi}&language=fr-FR&query=${encodeURIComponent(terme)}`;
    return this.importerFilms(url);
  }

  /**
   * Recherche des séries par mot-clé
   */
  public rechercherSeries(terme: string): Observable<UnFilm[]> {
    const url = `${this.urlBase}/search/tv?api_key=${this.cleApi}&language=fr-FR&query=${encodeURIComponent(terme)}`;
    return this.importerFilms(url);
  }

  /**
   * Méthode générique pour importer des films/séries
   */
  public importerFilms(requete: string): Observable<UnFilm[]> {
    return this.httpClient.get<UnePage>(requete).pipe(
      map(page => {
        // Transformation des résultats bruts en instances de UnFilm
        return page.results.map(item => new UnFilm(item));
      })
    );
  }
}
