import { IonicModule } from '@ionic/angular';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import {CardOeuvreComponent} from "../card-oeuvre/card-oeuvre.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    CardOeuvreComponent
  ],
  declarations: [HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
