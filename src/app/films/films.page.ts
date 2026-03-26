import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Bddfilms } from '../services/stockageFilmAPI';
import { UnFilm } from '../modeles/unFilm';
import { Router } from '@angular/router';
import {StockageFilmLocal} from "../services/stockageFilmLocal";
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



  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  public stockageFilmLocal = inject(StockageFilmLocal);
  public stockageFilmAPI = inject(Bddfilms)

  ngOnInit() {
    if (this.stockageFilmAPI.listeAVenir.length === 0) {
      this.stockageFilmAPI.chargerFilmsAVenir();
    }
    if (this.stockageFilmAPI.listeFilms.length === 0) {
      this.stockageFilmAPI.chargerFilmsPopulaires();
    }
    // Surveillance des changements locaux (favoris, en cours...)
    this.stockageFilmLocal.films$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  constructor() {}

  voirDetail(film: UnFilm) {
    this.router.navigate(['/detail-film'], { state: { film: film } });
  }
}
