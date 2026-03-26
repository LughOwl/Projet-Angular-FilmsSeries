import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeriesPage } from './series.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { CardFilmComponent } from "../card-film/card-film.component";
import { SeriesPageRoutingModule } from './series-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    CardFilmComponent,
    SeriesPageRoutingModule
  ],
  declarations: [SeriesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeriesPageModule {}
