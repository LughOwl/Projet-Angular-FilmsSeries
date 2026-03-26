import { Component, Input } from '@angular/core';
import { UnFilm } from "../../bdd/unFilm";

@Component({
  selector: 'app-card-film',
  templateUrl: './card-film.component.html',
  styleUrls: ['./card-film.component.scss'],
  standalone: false,
})
export class CardFilmComponent {
  @Input() film!: UnFilm;
}
