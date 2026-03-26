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
  listeFilms: UnFilm[] = [];
  listeSeries: UnFilm[] = [];
  chargementFilms: boolean = true;
  chargementSeries: boolean = true;

  private destroyRef = inject(DestroyRef);
  private abonnementFilms!: Subscription;
  private abonnementSeries!: Subscription;

  constructor(
    private bddFilms: Bddfilms,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chargerFilms();
    this.chargerSeries();
  }

  chargerFilms() {
    this.chargementFilms = true;
    this.abonnementFilms = this.bddFilms.getFilmsPopulaires()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (films) => {
          this.listeFilms = films;
          this.chargementFilms = false;
          this.cdr.detectChanges();
          console.log(`${films.length} films chargés pour le slider`);
        },
        error: (erreur) => {
          console.error('Erreur chargement films:', erreur);
          this.chargementFilms = false;
          this.cdr.detectChanges();
        }
      });
  }

  chargerSeries() {
    this.chargementSeries = true;
    this.abonnementSeries = this.bddFilms.getSeriesPopulaires()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (series) => {
          this.listeSeries = series;
          this.chargementSeries = false;
          this.cdr.detectChanges();
          console.log(`${series.length} séries chargées pour le slider`);
        },
        error: (erreur) => {
          console.error('Erreur chargement séries:', erreur);
          this.chargementSeries = false;
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    if (this.abonnementFilms) this.abonnementFilms.unsubscribe();
    if (this.abonnementSeries) this.abonnementSeries.unsubscribe();
  }
}
