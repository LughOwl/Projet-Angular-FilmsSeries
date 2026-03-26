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
  // Listes de films et séries
  listeFilms: UnFilm[] = [];
  listeSeries: UnFilm[] = [];

  // États de chargement
  chargementFilms: boolean = true;
  chargementSeries: boolean = true;

  // Gestion des abonnements
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
          this.listeFilms = films.slice(0, 20);
          this.chargementFilms = false;
          this.cdr.detectChanges();
          console.log(`${films.length} films chargés`);
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
          this.listeSeries = series.slice(0, 20);
          this.chargementSeries = false;
          this.cdr.detectChanges();
          console.log(`${series.length} séries chargées`);
        },
        error: (erreur) => {
          console.error('Erreur chargement séries:', erreur);
          this.chargementSeries = false;
          this.cdr.detectChanges();
        }
      });
  }

  // Nettoyage des abonnements
  ngOnDestroy() {
    if (this.abonnementFilms) this.abonnementFilms.unsubscribe();
    if (this.abonnementSeries) this.abonnementSeries.unsubscribe();
  }
}
