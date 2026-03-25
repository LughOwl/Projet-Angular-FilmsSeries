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

  // la liste de films
  _listeFilms: UnFilm[] = [];

  // le service pour détruire la subscription
  private destroyRef = inject(DestroyRef);

  constructor(
    private _BDFilms: Bddfilms,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Remplacez VOTRE_CLE par votre vraie clé API TMDb
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=b0e3bb5a46ad602897aba592b2967fe2&query=Terminator';

    this._filmsSubscription = this._BDFilms.importFilms(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(films => {
        this._listeFilms = films;
        this.cdr.detectChanges();
        console.log('Films chargés:', this._listeFilms);
      });
  }
}
