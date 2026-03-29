import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StockageOeuvreAPI } from '../services/stockageOeuvreAPI';
import { Film } from '../modeles/film';
import { Router } from '@angular/router';
import { StockageOeuvreLocal } from "../services/stockageOeuvreLocal";
import { CardOeuvreComponent } from "../card-oeuvre/card-oeuvre.component"

@Component({
  selector: 'app-films',
  templateUrl: './films.page.html',
  styleUrls: ['./films.page.scss'],
  standalone: false,
})
export class FilmsPage implements OnInit {

  public filmsPopulaires: Film[] = [];
  public filmsAVenir: Film[] = [];

  public chargementPopulaires: boolean = true;
  public chargementAVenir: boolean = true;

  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  public stockageFilmLocal = inject(StockageOeuvreLocal);
  public stockageFilmAPI = inject(StockageOeuvreAPI)

  ngOnInit() {
    this.stockageFilmAPI.getFilmsPopulaires().subscribe({
      next: (films) => {
        this.filmsPopulaires = films;
        this.chargementPopulaires = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement films populaires:', err);
        this.chargementPopulaires = false;
      }
    });

    this.stockageFilmAPI.getFilmsAVenir().subscribe({
      next: (films) => {
        this.filmsAVenir = films;
        this.chargementAVenir = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement films à venir:', err);
        this.chargementAVenir = false;
      }
    });

    this.stockageFilmLocal.films$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  constructor() {}

  voirDetail(film: Film) {
    this.router.navigate(['/detail-oeuvre'], { state: { oeuvre: film } });
  }

  naviguerAvecFiltre(filtre: { statut?: string; type?: string; favoris?: string }) {
    this.router.navigate(['/tabs/naviguer'], {
      queryParams: filtre
    });
  }
}
