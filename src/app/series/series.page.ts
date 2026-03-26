import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { StockageFilmAPI } from '../services/stockageFilmAPI';
import { UnFilm } from '../modeles/unFilm';
import { StockageFilmLocal } from '../services/stockageFilmLocal';

@Component({
  selector: 'app-series',
  templateUrl: './series.page.html',
  styleUrls: ['./series.page.scss'],
  standalone: false,
})
export class SeriesPage implements OnInit {
  // Listes pour chaque catégorie
  public seriesPopulaires: UnFilm[] = [];
  public seriesAVenir: UnFilm[] = [];

  // États de chargement
  public chargementPopulaires: boolean = true;
  public chargementAVenir: boolean = true;

  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  public stockageFilmLocal = inject(StockageFilmLocal);
  public stockageFilmAPI = inject(StockageFilmAPI);

  ngOnInit() {
    // Charger les séries populaires
    this.stockageFilmAPI.getSeriesPopulaires().subscribe({
      next: (series) => {
        this.seriesPopulaires = series;
        this.chargementPopulaires = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement séries populaires:', err);
        this.chargementPopulaires = false;
      }
    });

    // Charger les séries à venir
    this.stockageFilmAPI.getSeriesAVenir().subscribe({
      next: (series) => {
        this.seriesAVenir = series;
        this.chargementAVenir = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement séries à venir:', err);
        this.chargementAVenir = false;
      }
    });

    // Surveiller les changements locaux
    this.stockageFilmLocal.films$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  voirDetail(serie: UnFilm) {
    this.router.navigate(['/detail-film'], { state: { film: serie } });
  }
}
