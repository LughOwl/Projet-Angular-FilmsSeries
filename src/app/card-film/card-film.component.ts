import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UnFilm } from "../bdd/unFilm";

@Component({
  selector: 'app-card-film',
  templateUrl: './card-film.component.html',
  styleUrls: ['./card-film.component.scss'],
  standalone: true,
})
export class CardFilmComponent {
  @Input() film!: UnFilm;
  @Output() filmClick = new EventEmitter<UnFilm>();

  onClick() {
    this.filmClick.emit(this.film);
  }
}
