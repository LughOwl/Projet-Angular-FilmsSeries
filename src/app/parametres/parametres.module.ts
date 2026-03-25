import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParametresPage } from './parametres.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import {ParametresPageRoutingModule} from './parametres-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ParametresPageRoutingModule
  ],
  declarations: [ParametresPage]
})
export class ParametresPageModule {}
