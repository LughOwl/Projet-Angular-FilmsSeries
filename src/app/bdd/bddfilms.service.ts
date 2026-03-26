import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnFilm } from './unFilm';
import { UnePage } from './unePage';

@Injectable({
  providedIn: 'root',
})
export class Bddfilms {
  // Liste des films résultats de la requête
  listeFilms: UnFilm[] = [];

  constructor(private httpClient: HttpClient) {}

  public importFilms(requete: string): Observable<UnFilm[]> {
    // On vide la liste locale avant chaque nouvel import
    this.listeFilms = [];

    // On récupère uniquement la page demandée (la première par défaut)
    return this.httpClient.get<UnePage>(requete).pipe(
      map(page => {
        // On transforme les résultats bruts en instances de la classe UnFilm
        const nouveauxFilms = page.results.map(item => new UnFilm(item));

        // On met à jour la liste locale du service
        this.listeFilms = nouveauxFilms;

        return nouveauxFilms;
      })
    );
  }
}
