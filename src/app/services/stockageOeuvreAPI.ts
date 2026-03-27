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

  // Ajoute ces propriétés pour stocker les données
  public listeFilms: Film[] = [];
  public listeSeries: Serie[] = [];
  public listeFilmsAVenir: Film[] = [];
  public listeSeriesAVenir: Serie[] = [];  // ← NOUVEAU pour les séries à venir

  public chargementFilms: boolean = false;
  public chargementSeries: boolean = false;
  public chargementFilmsAVenir: boolean = false;
  public chargementSeriesAVenir: boolean = false;  // ← NOUVEAU pour les séries à venir

  // ─── RECHERCHE PRINCIPALE ────────────────────────────────────────────────────
  public obtenirBandeAnnonce(idFilm: number): Observable<string | null> {
    // 1. UTILISE LES BACKTICKS ICI
    const url = `${this.urlBase}/movie/${idFilm}/videos?api_key=${this.cleApi}&language=fr-FR`;

    return this.httpClient.get<any>(url).pipe(
      map(res => {
        // 2. On trouve la vidéo
        const video = res.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

        // 3. ON RENVOIE L'URL YOUTUBE, PAS JUSTE L'OBJET
        return video ? `https://www.youtube.com/watch?v=${video.key}` : null;
      })
    );
  }
  /**
   * Recherche des films/séries sur TMDB selon un terme et des filtres.
   * Utilisé uniquement quand statut = 'tous' (les autres passent par le local).
   */
  rechercherSurAPI(terme: string, filtres: FiltresRecherche, page: number = 1): Observable<ResultatRecherche> {
    const url = this.construireURL(terme, filtres.type, page);

    return this.httpClient.get<UnePage>(url).pipe(
      map(reponse => {
        let resultats = reponse.results.map(item => new Film(item));

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

  /** Séries populaires (utilisé dans l'Accueil) */
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

  /** Films à venir (utilisé dans la page Films) */
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

  /** Séries à venir (utilisé dans la page Séries) */
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

  // ─── TRI ─────────────────────────────────────────────────────────────────────

  /** Trie une liste de films selon le critère choisi */
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
