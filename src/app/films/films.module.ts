import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';  // ← ajouter CUSTOM_ELEMENTS_SCHEMA
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilmsPage } from './films.page';
import { FilmsPageRoutingModule } from './films-routing.module';
import {CardOeuvreComponent} from "../card-oeuvre/card-oeuvre.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FilmsPageRoutingModule,
    CardOeuvreComponent
  ],
  declarations: [FilmsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // ← AJOUTER CETTE LIGNE
})
export class FilmsPageModule {}
