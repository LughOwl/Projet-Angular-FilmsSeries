import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParametresPage } from './parametres.page';

import {ParametresPageRoutingModule} from './parametres-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ParametresPageRoutingModule
  ],
  declarations: [ParametresPage]
})
export class ParametresPageModule {}
