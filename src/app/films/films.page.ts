import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StockageFilmAPI } from '../services/stockageFilmAPI';
import { Film } from '../modeles/film';
import { Router } from '@angular/router';
import { StockageFilmLocal } from "../services/stockageFilmLocal";
import { CardOeuvreComponent } from "../card-oeuvre/card-oeuvre.component"

export interface FilmUtilisateur {
  film: Film;
  statut: 'en_cours' | 'a_voir' | 'termine' | 'non_vu';
  estFavori: boolean;
  dateAjout: Date;
  progression?: string;
}

@Component({
  selector: 'app-films',
  templateUrl: './films.page.html',
  styleUrls: ['./films.page.scss'],
  standalone: false,
})
export class FilmsPage implements OnInit {

  public filmsPopulaires: Film[] = [];
  public filmsAVenir: Film[] = [];

  // Ajoute ces propriétés d'état
  public chargementPopulaires: boolean = true;
  public chargementAVenir: boolean = true;

  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  public stockageFilmLocal = inject(StockageFilmLocal);
  public stockageFilmAPI = inject(StockageFilmAPI)

  ngOnInit() {
    // Charge les films populaires
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

    // Charge les films à venir
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

    // Surveillance des changements locaux (favoris, en cours...)
    this.stockageFilmLocal.films$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  constructor() {}

  voirDetail(film: Film) {
    this.router.navigate(['/detail-oeuvre'], { state: { oeuvre: film } }); // ← Changé
  }
}
