import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Film } from '../../models/film';
import { GestionFilmsService } from '../../services/gestion-films.service';

@Component({
  selector: 'app-liste-films',
  templateUrl: './liste-films.component.html'
})
export class ListeFilmsComponent implements OnInit {
  films$!: Observable<Film[]>;

  constructor(
    private serviceFilms: GestionFilmsService,
    private routeur: Router
  ) {}

  ngOnInit(): void {
    this.films$ = this.serviceFilms.obtenirFilms();
  }

  ouvrirDetails(id: number): void {
    this.routeur.navigate(['/details', id]);
  }

  supprimer(id: number): void {
    this.serviceFilms.supprimerFilm(id);
  }
}