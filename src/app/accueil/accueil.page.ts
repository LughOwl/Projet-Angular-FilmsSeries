import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { StockageOeuvreAPI } from '../services/stockageOeuvreAPI';
import { StockageOeuvreLocal } from '../services/stockageOeuvreLocal';
import { Film } from '../modeles/film';
import { Serie } from '../modeles/serie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  templateUrl: 'accueil.page.html',
  styleUrls: ['accueil.page.scss'],
  standalone: false,
})
export class AccueilPage implements OnInit {
  listeFilms: Film[] = [];
  listeSeries: Serie[] = [];
  oeuvresEnCours: (Film | Serie)[] = [];

  public bddFilms = inject(StockageOeuvreAPI);
  public stockageFilmLocal = inject(StockageOeuvreLocal);

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

  naviguerAvecFiltre(type: 'en_cours' | 'films' | 'series') {
    const queryParams: any = {};

    switch(type) {
      case 'en_cours':
        queryParams.statut = 'en_cours';
        break;
      case 'films':
        queryParams.type = 'films';
        break;
      case 'series':
        queryParams.type = 'series';
        break;
    }

    this.router.navigate(['/tabs/naviguer'], {
      queryParams: queryParams
    });
  }

  voirDetail(oeuvre: Film | Serie) {
    this.router.navigate(['/detail-oeuvre'], { state: { oeuvre: oeuvre } });
  }
}
