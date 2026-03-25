import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CardFilmComponent } from './card-film/card-film.component';

@NgModule({
  declarations: [CardFilmComponent],
  imports: [CommonModule, IonicModule],
  exports: [CardFilmComponent]
})
export class ComponentsModule {}
