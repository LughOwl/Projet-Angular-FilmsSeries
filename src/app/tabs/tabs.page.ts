import {Component, ViewChild} from '@angular/core';
import {IonModal} from "@ionic/angular";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  @ViewChild(IonModal) modal!: IonModal;

  modeSombre: boolean = true;
  couleurSelectionnee: string = 'orange';

  codesCouleurs: { [key: string]: string } = {
    'orange': '#e67e22',
    'green': '#2ecc71',
    'blue': '#3498db',
    'purple': '#9b59b6'
  };

  constructor() {}

  // Change le mode (Sombre/Clair)
  setMode(isSombre: boolean) {
    this.modeSombre = isSombre;
  }

  // Change la couleur sélectionnée
  setCouleur(couleur: string) {
    this.couleurSelectionnee = couleur;
    document.documentElement.style.setProperty('--main-color', this.codesCouleurs[couleur])
  }

  fermerParametres(){
    this.modal.dismiss();
  }
}
