import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StockageFilmAPI } from '../services/stockageFilmAPI';
import { UnFilm } from '../modeles/unFilm';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  listeFilms: UnFilm[] = [];
  listeSeries: UnFilm[] = [];

  public bddFilms = inject(StockageFilmAPI)

  constructor(){}

  ngOnInit() {
    // S'abonner aux Observables pour remplir les listes
    this.bddFilms.getFilmsPopulaires().subscribe(films => {
      this.listeFilms = films;
    });

    this.bddFilms.getSeriesPopulaires().subscribe(series => {
      this.listeSeries = series;
    });
  }
}
