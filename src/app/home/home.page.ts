import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StockageFilmAPI } from '../services/stockageFilmAPI';
import { StockageFilmLocal } from '../services/stockageFilmLocal';
import { UnFilm } from '../modeles/unFilm';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  listeFilms: UnFilm[] = [];
  listeSeries: UnFilm[] = [];
  oeuvresEnCours: UnFilm[] = [];

  public bddFilms = inject(StockageFilmAPI);
  public stockageFilmLocal = inject(StockageFilmLocal);

  private cdr = inject(ChangeDetectorRef);
  protected router = inject(Router);

  constructor() {}

  ngOnInit() {
    // Charge les films populaires
    this.bddFilms.getFilmsPopulaires().subscribe(films => {
      this.listeFilms = films;
      this.cdr.detectChanges();
    });

    // Charge les séries populaires
    this.bddFilms.getSeriesPopulaires().subscribe(series => {
      this.listeSeries = series;
      this.cdr.detectChanges();
    });

    // Surveille les changements des œuvres en cours
    this.stockageFilmLocal.films$.subscribe(() => {
      this.oeuvresEnCours = this.stockageFilmLocal.getFilmsParStatut("en_cours");
      this.cdr.detectChanges();
    });
  }

  // Méthode pour naviguer vers les détails
  voirDetail(oeuvre: UnFilm) {
    this.router.navigate(['/detail-film'], { state: { film: oeuvre } });
  }
}
