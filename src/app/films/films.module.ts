import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilmsPage } from './films.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FilmsPageRoutingModule } from './films-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FilmsPageRoutingModule
  ],
  declarations: [FilmsPage]
})
export class FilmsPageModule {}
