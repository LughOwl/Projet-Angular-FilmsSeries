import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NaviguerPage } from './naviguer.page';
import { FiltresRechercheComponent } from '../filtres-recherche/filtres-recherche.component';
import { NaviguerPageRoutingModule } from './naviguer-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NaviguerPageRoutingModule
  ],
  declarations: [NaviguerPage, FiltresRechercheComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NaviguerPageModule {}
