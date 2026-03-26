import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Bddfilms } from '../bdd/bddfilms.service';
import { UnFilm } from '../bdd/unFilm';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  // le résultat de la subscription à l’Observable
  private _filmsSubscription!: Subscription;
  private _SeriesSubscription!: Subscription;
  // la liste de films
  _listeFilms: UnFilm[] = [];
  _listeSeries: UnFilm[] = [];
  // le service pour détruire la subscription
  private destroyRef = inject(DestroyRef);

  constructor(
    private _BDFilms: Bddfilms,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Remplacez VOTRE_CLE par votre vraie clé API TMDb
    const urlFilm = 'https://api.themoviedb.org/3/movie/popular?api_key=b0e3bb5a46ad602897aba592b2967fe2&language=fr-FR';
    const urlSeries = 'https://api.themoviedb.org/3/tv/popular?api_key=b0e3bb5a46ad602897aba592b2967fe2&language=fr-FR';
    this._filmsSubscription = this._BDFilms.importFilms(urlFilm)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(films => {
        this._listeFilms = films.slice(0,20);
        this.cdr.detectChanges();
        console.log('Films chargés:', this._listeFilms);
      });

    this._SeriesSubscription = this._BDFilms.importFilms(urlSeries)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(films => {
        this._listeSeries = films.slice(0,20);
        this.cdr.detectChanges();
        console.log('Series chargés:', this._listeSeries);
      });
  }
}
