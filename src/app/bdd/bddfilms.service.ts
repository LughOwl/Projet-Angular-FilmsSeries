import {inject, Injectable} from '@angular/core';
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

// Interface pour les filtres de recherche
export interface FiltresRecherche {
  tri: 'titre_az' | 'titre_za' | 'note' | 'ajout' | 'popularite' | 'recent';
  statut: 'tous' | 'non_vu' | 'en_cours' | 'termine' | 'a_voir';
  type: 'tous' | 'films' | 'series';
  favoris: 'tous' | 'favoris' | 'non_favoris';
  sortie: 'deja_sorti' | 'prochainement' | 'tous';
  genres: number[];
}

// Interface pour le résultat de recherche
export interface ResultatRecherche {
  resultats: UnFilm[];
  total: number;
  page: number;
  totalPages: number;
}

// Mapping des IDs de genres
export const GENRES_MAP: { [key: number]: string } = {
  28: 'Action',
  12: 'Aventure',
  16: 'Animation',
  35: 'Comédie',
  80: 'Crime',
  99: 'Documentaire',
  18: 'Drame',
  10751: 'Familial',
  14: 'Fantastique',
  36: 'Histoire',
  27: 'Horreur',
  10402: 'Musique',
  9648: 'Mystère',
  10749: 'Romance',
  878: 'Science-fiction',
  10770: 'Téléfilm',
  53: 'Thriller',
  10752: 'Guerre',
  37: 'Western'
};

@Injectable({
  providedIn: 'root',
})
export class Bddfilms {
  // Clé API TMDB
  private readonly cleApi = 'b0e3bb5a46ad602897aba592b2967fe2';
  private readonly urlBase = 'https://api.themoviedb.org/3';
  private httpClient = inject(HttpClient);
  constructor() {}

  /**
   * Récupère les films populaires (20 premiers)
   */
  public getFilmsPopulaires(): Observable<UnFilm[]> {
    const url = `${this.urlBase}/movie/popular?api_key=${this.cleApi}&language=fr-FR&page=1`;
    return this.httpClient.get<UnePage>(url).pipe(
      map(page => page.results.map(item => new UnFilm(item)))
    );
  }

  public importerFilms(requete: string): Observable<UnFilm[]> {
    return this.httpClient.get<UnePage>(requete).pipe(
      map(page => {
        // Transformation des résultats bruts en instances de UnFilm
        return page.results.map(item => new UnFilm(item));
      })
    );
  }

  public getFilmsAVenir(): Observable<UnFilm[]> {
    const url = `${this.urlBase}/movie/upcoming?api_key=${this.cleApi}&language=fr-FR&region=FR`;
    return this.importerFilms(url);
  }
  /**
   * Récupère les séries populaires (20 premières)
   */
  public getSeriesPopulaires(): Observable<UnFilm[]> {
    const url = `${this.urlBase}/tv/popular?api_key=${this.cleApi}&language=fr-FR&page=1`;
    return this.httpClient.get<UnePage>(url).pipe(
      map(page => page.results.map(item => new UnFilm(item)))
    );
  }

  /**
   * Recherche générique avec pagination
   */
  public rechercherAvecFiltres(terme: string, filtres: FiltresRecherche, page: number = 1): Observable<ResultatRecherche> {
    let url: string;

    // Déterminer le type de recherche
    if (filtres.type === 'films') {
      url = `${this.urlBase}/search/movie?api_key=${this.cleApi}&language=fr-FR&page=${page}`;
    } else if (filtres.type === 'series') {
      url = `${this.urlBase}/search/tv?api_key=${this.cleApi}&language=fr-FR&page=${page}`;
    } else {
      url = `${this.urlBase}/search/multi?api_key=${this.cleApi}&language=fr-FR&page=${page}`;
    }

    if (terme && terme.trim()) {
      url += `&query=${encodeURIComponent(terme)}`;
    }

    // Filtrer par genres si sélectionnés
    if (filtres.genres.length > 0) {
      url += `&with_genres=${filtres.genres.join(',')}`;
    }

    return this.httpClient.get<UnePage>(url).pipe(
      map(page => {
        let resultats = page.results.map(item => new UnFilm(item));

        console.log(`Avant filtrage date: ${resultats.length} résultats`);

        // Filtrer par date de sortie (côté client car l'API ne le fait pas bien)
        const dateActuelle = new Date();
        dateActuelle.setHours(0, 0, 0, 0); // Normaliser la date actuelle à minuit

        if (filtres.sortie === 'deja_sorti') {
          resultats = resultats.filter(f => {
            const dateSortieStr = f.dateSortieComplete;
            if (!dateSortieStr || dateSortieStr === 'Date inconnue') return false;

            const dateSortie = new Date(dateSortieStr);
            dateSortie.setHours(0, 0, 0, 0);

            // Vérifier si la date est valide
            if (isNaN(dateSortie.getTime())) return false;

            return dateSortie <= dateActuelle;
          });
          console.log(`Après filtrage "Déjà sorti": ${resultats.length} résultats`);
        } else if (filtres.sortie === 'prochainement') {
          resultats = resultats.filter(f => {
            const dateSortieStr = f.dateSortieComplete;
            if (!dateSortieStr || dateSortieStr === 'Date inconnue') return false;

            const dateSortie = new Date(dateSortieStr);
            dateSortie.setHours(0, 0, 0, 0);

            // Vérifier si la date est valide
            if (isNaN(dateSortie.getTime())) return false;

            return dateSortie > dateActuelle;
          });
          console.log(`Après filtrage "Prochainement": ${resultats.length} résultats`);
        }

        return {
          resultats: resultats,
          total: page.total_results,
          page: page.page,
          totalPages: page.total_pages
        };
      })
    );
  }

  /**
   * Applique le tri sur une liste de résultats
   */
  public trierResultats(resultats: UnFilm[], tri: string): UnFilm[] {
    const resultatsCopie = [...resultats];

    switch (tri) {
      case 'titre_az':
        return resultatsCopie.sort((a, b) => a.titre.localeCompare(b.titre));
      case 'titre_za':
        return resultatsCopie.sort((a, b) => b.titre.localeCompare(a.titre));
      case 'note':
        return resultatsCopie.sort((a, b) => b.note - a.note);
      case 'popularite':
        return resultatsCopie.sort((a, b) => b.note - a.note);
      case 'recent':
        return resultatsCopie.sort((a, b) => {
          const dateA = new Date(a.dateSortieComplete);
          const dateB = new Date(b.dateSortieComplete);
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;
          return dateB.getTime() - dateA.getTime();
        });
      case 'ajout':
      default:
        return resultatsCopie;
    }
  }
}
