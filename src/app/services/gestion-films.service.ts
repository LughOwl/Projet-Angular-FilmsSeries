import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Film } from '../models/film';

const CLE_STOCKAGE = 'mesFilmsLocales';

@Injectable({
  providedIn: 'root'
})
export class GestionFilmsService {
  private sujetFilms: BehaviorSubject<Film[]>;

  constructor() {
    let filmsInitiaux: Film[] = [];
    const donneesBrutes = localStorage.getItem(CLE_STOCKAGE);
    if (donneesBrutes !== null) {
      try {
        const parse = JSON.parse(donneesBrutes);
        if (Array.isArray(parse)) {
          filmsInitiaux = parse;
        }
      } catch (erreur) {
        console.error('Erreur lecture localStorage:', erreur);
      }
    }
    this.sujetFilms = new BehaviorSubject<Film[]>(filmsInitiaux);
  }

  obtenirFilms(): Observable<Film[]> {
    return this.sujetFilms.asObservable();
  }

  ajouterFilm(nouveauFilm: Film): void {
    const courant = this.sujetFilms.getValue();
    const copie = courant.slice();
    copie.push(nouveauFilm);
    this.enregistrerEtEmettre(copie);
  }

  mettreAJourFilm(filmMisAJour: Film): void {
    const courant = this.sujetFilms.getValue();
    const copie = courant.map(f => {
      if (f.id === filmMisAJour.id) {
        return { ...f, ...filmMisAJour };
      }
      return f;
    });
    this.enregistrerEtEmettre(copie);
  }

  supprimerFilm(id: number): void {
    const courant = this.sujetFilms.getValue();
    const filtre = courant.filter(f => f.id !== id);
    this.enregistrerEtEmettre(filtre);
  }

  trouverParId(id: number): Film | undefined {
    const courant = this.sujetFilms.getValue();
    return courant.find(f => f.id === id);
  }

  vider(): void {
    this.enregistrerEtEmettre([]);
  }

  private enregistrerEtEmettre(films: Film[]): void {
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(films));
      this.sujetFilms.next(films.slice());
    } catch (erreur) {
      console.error('Erreur écriture localStorage:', erreur);
    }
  }
}