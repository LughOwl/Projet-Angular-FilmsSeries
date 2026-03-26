import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Bddfilms } from '../bdd/bddfilms.service';
import { UnFilm } from '../bdd/unFilm';
import { Router } from '@angular/router';
import {StockageFilm} from "../service/stockageFilm";
import {CardFilmComponent} from"../card-film/card-film.component"

export interface FilmUtilisateur {
  film: UnFilm;
  statut: 'en_cours' | 'a_voir' | 'termine' | 'non_vu';
  estFavori: boolean;
  dateAjout: Date;
  progression?: string;
}

@Component({
  selector: 'app-films',
  templateUrl: './films.page.html',
  styleUrls: ['./films.page.scss'],
  standalone: false,
})
export class FilmsPage implements OnInit {
  // Listes pour chaque catégorie (attention aux noms !)

  listeSuggestions: UnFilm[] = [];      // ← nom exact
  listeAVenir: UnFilm[] = [];           // ← nom exact
  listeFavoris: UnFilm[] = [];
  listeEnCours: UnFilm[] = [];
  listeTermine: UnFilm[] = [];
  listeAVoir: UnFilm[] = [];

  // États de chargement
  chargementSuggestions: boolean = true;
  chargementAVenir: boolean = true;

  // Injection avec la fonction inject()
  private destroyRef = inject(DestroyRef);
  private bddFilms = inject(Bddfilms);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private stockageFilm = inject(StockageFilm);

  private abonnementFilmsAVenir!: Subscription;
  private abonnementFilmsSuggestion!: Subscription;



  constructor() {}
  ngOnInit() {
    this.chargerFilmsAVenir();
    this.chargerSuggestions();
    this.stockageFilm.films$.subscribe(() => {
      this.chargerListesLocales();
    });
  }

  chargerListesLocales(){
    this.listeFavoris = this.stockageFilm.getFavoris();
    this.listeEnCours = this.stockageFilm.getFilmsParStatut('en_cours');
    this.listeTermine = this.stockageFilm.getFilmsParStatut('termine');
    this.listeAVoir = this.stockageFilm.getFilmsParStatut('a_voir');
    this.cdr.detectChanges();
  }

  chargerFilmsAVenir() {
    this.chargementAVenir = true;
    this.abonnementFilmsAVenir = this.bddFilms.getFilmsAVenir()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:(filmAVenir) => {
          this.listeAVenir = filmAVenir.slice(0,20);
          this.chargementAVenir = false;
          this.cdr.detectChanges();
          console.log(`${filmAVenir.length} films chargés`);
        }
      });
  }

  chargerSuggestions(){
    this.chargementSuggestions = true;
    this.abonnementFilmsSuggestion = this.bddFilms.getFilmsPopulaires()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:(films) => {
          this.listeSuggestions = films.slice(0,20);
          this.chargementSuggestions = false;
          this.cdr.detectChanges();
          console.log(`${films.length} films chargés`);
        }
      });
  }

  voirDetail(film: UnFilm) {
    this.router.navigate(['/detail-film'], { state: { film: film } });
  }
}
