import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, tap, switchMap, defaultIfEmpty } from 'rxjs/operators';
import { UnFilm } from './unFilm';
import { UnePage } from './unePage';

@Injectable({
  providedIn: 'root',
})
export class Bddfilms {
  // liste des films résultats de la requête
  listeFilms: UnFilm[] = [];

  constructor(private httpClient: HttpClient) {}

  public importFilms(requete: string): Observable<UnFilm[]> {
    this.listeFilms = [];

    // la première requête va obtenir la première page
    let premierePage = this.httpClient.get<UnePage>(requete).pipe(
      tap(page => {
        // On ajoute les films de la première page
        page.results.forEach(item => {
          console.log(item);
          this.listeFilms.push(new UnFilm(item));
        });
      })
    );

    // Puis on enchaîne sur les pages suivantes depuis la première page
    return premierePage.pipe(
      switchMap(page => {
        // on calcule le nombre de pages à obtenir
        const length = page.total_pages - 1;

        // tableau des numéros de pages à obtenir
        const arr = Array.from({ length }, (_, i) => 2 + i * 1);

        // tableau des observables pour les pages à obtenir
        let obs = arr.map((id) =>
          this.httpClient.get<UnePage>(requete + "&page=" + id)
        );

        // on requête TOUTES les pages restantes grâce à forkJoin
        // forkJoin termine lorsque la dernière requête termine
        return forkJoin(obs).pipe(
          // defaultIfEmpty est utilisé pour générer next même si length = 0
          defaultIfEmpty(null),
          map(res => {
            // res est null si length = 0, rien à faire
            if (res != null) {
              // On parcourt les nouvelles pages obtenues
              res.forEach(page => {
                // Pour chaque page, on parcourt les films
                page.results.forEach(item => {
                  this.listeFilms.push(new UnFilm(item));
                });
              });
            }
            return this.listeFilms;
          })
        );
      })
    );
  }
}
