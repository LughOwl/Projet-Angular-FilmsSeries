import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Film } from '../modeles/film';
import { Serie } from '../modeles/serie';

@Component({
  selector: 'app-card-oeuvre',
  templateUrl: './card-oeuvre.component.html',
  styleUrls: ['./card-oeuvre.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CardOeuvreComponent {
  @Input() oeuvre!: Film | Serie;
  @Output() oeuvreClick = new EventEmitter<Film | Serie>();

  onClick() {
    this.oeuvreClick.emit(this.oeuvre);
  }
}
