import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Bddfilms } from '../services/stockageFilmAPI';
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


  public bddFilms = inject(Bddfilms)

  constructor(){}

  ngOnInit() {
    // On déclenche le chargement si les listes sont vides
    if (this.bddFilms.listeFilms.length === 0) {
      this.bddFilms.chargerFilmsPopulaires();
    }
    if (this.bddFilms.listeSeries.length === 0) {
      this.bddFilms.chargerSeriesPopulaires();
    }
  }

}

