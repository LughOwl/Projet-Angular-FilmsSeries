import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigerPage } from './naviger.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import {NaviguerPageRoutingModule} from './naviguer-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    NaviguerPageRoutingModule
  ],
  declarations: [NavigerPage]
})
export class NaviguerPageModule {}
