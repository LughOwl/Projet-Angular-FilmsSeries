import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { StockageFilmAPI } from '../services/stockageFilmAPI';
import { StockageFilmLocal } from '../services/stockageFilmLocal';
import { Film } from '../modeles/film';
import { Serie } from '../modeles/serie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  listeFilms: Film[] = [];
  listeSeries: Serie[] = [];
  oeuvresEnCours: (Film | Serie)[] = [];

  public bddFilms = inject(StockageFilmAPI);
  public stockageFilmLocal = inject(StockageFilmLocal);

  private cdr = inject(ChangeDetectorRef);
  protected router = inject(Router);

  constructor() {}

  ngOnInit() {
    this.bddFilms.getFilmsPopulaires().subscribe(films => {
      this.listeFilms = films;
      this.cdr.detectChanges();
    });

    this.bddFilms.getSeriesPopulaires().subscribe(series => {
      this.listeSeries = series;
      this.cdr.detectChanges();
    });

    this.stockageFilmLocal.films$.subscribe(() => {
      this.oeuvresEnCours = this.stockageFilmLocal.getOeuvresParStatut("en_cours");
      this.cdr.detectChanges();
    });
  }

  voirDetail(oeuvre: Film | Serie) {
    this.router.navigate(['/detail-oeuvre'], { state: { oeuvre: oeuvre } });
  }
}
