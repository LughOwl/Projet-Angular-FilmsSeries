import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnFilm } from '../modeles/unFilm';
import { FiltresRecherche, ResultatRecherche } from '../modeles/filtresRecherche';

// Structure brute d'une page renvoyée par TMDB
interface UnePage {
  page: number;
  total_pages: number;
  total_results: number;
  results: any[];
}

@Injectable({ providedIn: 'root' })
export class StockageFilmAPI {
  private readonly cleApi = 'b0e3bb5a46ad602897aba592b2967fe2';
  private readonly urlBase = 'https://api.themoviedb.org/3';
  private httpClient = inject(HttpClient);

  // Ajoute ces propriétés pour stocker les données
  public listeFilms: UnFilm[] = [];
  public listeSeries: UnFilm[] = [];
  public listeFilmsAVenir: UnFilm[] = [];
  public listeSeriesAVenir: UnFilm[] = [];  // ← NOUVEAU pour les séries à venir

  public chargementFilms: boolean = false;
  public chargementSeries: boolean = false;
  public chargementFilmsAVenir: boolean = false;
  public chargementSeriesAVenir: boolean = false;  // ← NOUVEAU pour les séries à venir

  // ─── RECHERCHE PRINCIPALE ────────────────────────────────────────────────────

  /**
   * Recherche des films/séries sur TMDB selon un terme et des filtres.
   * Utilisé uniquement quand statut = 'tous' (les autres passent par le local).
   */
  rechercherSurAPI(terme: string, filtres: FiltresRecherche, page: number = 1): Observable<ResultatRecherche> {
    const url = this.construireURL(terme, filtres.type, page);

    return this.httpClient.get<UnePage>(url).pipe(
      map(reponse => {
        let resultats = reponse.results.map(item => new UnFilm(item));

        // Tri côté client
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

  // ─── REQUÊTES TMDB SPÉCIFIQUES ───────────────────────────────────────────────

  /** Films populaires (utilisé dans la page Films et Accueil) */
  getFilmsPopulaires(): Observable<UnFilm[]> {
    this.chargementFilms = true;
    const url = `${this.urlBase}/movie/popular?api_key=${this.cleApi}&language=fr-FR`;
    return this.httpClient.get<UnePage>(url).pipe(
      map(reponse => {
        const films = reponse.results.map(item => new UnFilm(item));
        this.listeFilms = films;
        this.chargementFilms = false;
        return films;
      })
    );
  }

  /** Séries populaires (utilisé dans l'Accueil) */
  getSeriesPopulaires(): Observable<UnFilm[]> {
    this.chargementSeries = true;
    const url = `${this.urlBase}/tv/popular?api_key=${this.cleApi}&language=fr-FR`;
    return this.httpClient.get<UnePage>(url).pipe(
      map(reponse => {
        const series = reponse.results.map(item => new UnFilm(item));
        this.listeSeries = series;
        this.chargementSeries = false;
        return series;
      })
    );
  }

  /** Films à venir (utilisé dans la page Films) */
  getFilmsAVenir(): Observable<UnFilm[]> {
    this.chargementFilmsAVenir = true;
    const url = `${this.urlBase}/movie/upcoming?api_key=${this.cleApi}&language=fr-FR&region=FR`;
    return this.httpClient.get<UnePage>(url).pipe(
      map(reponse => {
        const films = reponse.results.map(item => new UnFilm(item));
        this.listeFilmsAVenir = films;
        this.chargementFilmsAVenir = false;
        return films;
      })
    );
  }

  /** Séries à venir (utilisé dans la page Séries) */
  getSeriesAVenir(): Observable<UnFilm[]> {
    this.chargementSeriesAVenir = true;
    // On utilise "airing_today" pour les séries qui sortent aujourd'hui
    // ou "on_the_air" pour les séries actuellement diffusées
    const url = `${this.urlBase}/tv/airing_today?api_key=${this.cleApi}&language=fr-FR`;
    return this.httpClient.get<UnePage>(url).pipe(
      map(reponse => {
        const series = reponse.results.map(item => new UnFilm(item));
        this.listeSeriesAVenir = series;
        this.chargementSeriesAVenir = false;
        return series;
      })
    );
  }

  // ─── TRI ─────────────────────────────────────────────────────────────────────

  /** Trie une liste de films selon le critère choisi */
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

  /** Construit l'URL TMDB selon le type et le terme de recherche */
  private construireURL(terme: string, type: FiltresRecherche['type'], page: number): string {
    let endpoint: string;

    if (terme && terme.trim()) {
      // Recherche par mot-clé
      if (type === 'films') endpoint = 'search/movie';
      else if (type === 'series') endpoint = 'search/tv';
      else endpoint = 'search/multi';
    } else {
      // Pas de terme → liste populaire
      if (type === 'films') endpoint = 'movie/popular';
      else if (type === 'series') endpoint = 'tv/popular';
      else endpoint = 'movie/popular'; // défaut
    }

    let url = `${this.urlBase}/${endpoint}?api_key=${this.cleApi}&language=fr-FR&page=${page}`;

    if (terme && terme.trim()) {
      url += `&query=${encodeURIComponent(terme)}`;
    }

    return url;
  }
}
