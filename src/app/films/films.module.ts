import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';  // ← ajouter CUSTOM_ELEMENTS_SCHEMA
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilmsPage } from './films.page';
import { ComponentsModule } from '../components/components.module';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FilmsPageRoutingModule } from './films-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FilmsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [FilmsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // ← AJOUTER CETTE LIGNE
})
export class FilmsPageModule {}
