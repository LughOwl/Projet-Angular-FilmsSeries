import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Film } from '../../models/film';
import { GestionFilmsService } from '../../services/gestion-films.service';

@Component({
  selector: 'app-details-film',
  templateUrl: './details-film.component.html'
})
export class DetailsFilmComponent implements OnInit {
  filmAffiche?: Film;

  constructor(
    private routeActive: ActivatedRoute,
    private serviceFilms: GestionFilmsService,
    private routeur: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.routeActive.snapshot.paramMap.get('id');
    let idNum: number | null = null;
    if (idParam !== null) {
      idNum = Number(idParam);
    }
    if (idNum !== null && !Number.isNaN(idNum)) {
      this.filmAffiche = this.serviceFilms.trouverParId(idNum);
    }
  }

  retourner(): void {
    this.routeur.navigate(['/']);
  }

  supprimerEtRetourner(): void {
    if (this.filmAffiche) {
      this.serviceFilms.supprimerFilm(this.filmAffiche.id);
      this.routeur.navigate(['/']);
    }
  }
}