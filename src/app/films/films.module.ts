import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';  // ← ajouter CUSTOM_ELEMENTS_SCHEMA
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilmsPage } from './films.page';
import { CardFilmComponent} from "../card-film/card-film.component";
import { FilmsPageRoutingModule } from './films-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CardFilmComponent,
    FilmsPageRoutingModule
  ],
  declarations: [FilmsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // ← AJOUTER CETTE LIGNE
})
export class FilmsPageModule {}
