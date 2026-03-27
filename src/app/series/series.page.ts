import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { StockageFilmAPI } from '../services/stockageFilmAPI';
import { Serie } from '../modeles/serie';
import { StockageFilmLocal } from '../services/stockageFilmLocal';

@Component({
  selector: 'app-series',
  templateUrl: './series.page.html',
  styleUrls: ['./series.page.scss'],
  standalone: false,
})
export class SeriesPage implements OnInit {
  public seriesPopulaires: Serie[] = [];
  public seriesAVenir: Serie[] = [];

  public chargementPopulaires: boolean = true;
  public chargementAVenir: boolean = true;

  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  public stockageFilmLocal = inject(StockageFilmLocal);
  public stockageFilmAPI = inject(StockageFilmAPI);

  ngOnInit() {
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

    this.stockageFilmLocal.series$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  voirDetail(serie: Serie) {
    this.router.navigate(['/detail-oeuvre'], { state: { oeuvre: serie } });
  }

  naviguerAvecFiltre(filtre: { statut?: string; type?: string; favoris?: string }) {
    this.router.navigate(['/tabs/naviguer'], {
      queryParams: filtre
    });
  }
}
