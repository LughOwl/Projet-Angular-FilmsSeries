import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeriesPage } from './series.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { SeriesPageRoutingModule } from './series-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    SeriesPageRoutingModule
  ],
  declarations: [SeriesPage]
})
export class SeriesPageModule {}
