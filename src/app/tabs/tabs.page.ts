import {Component, ViewChild, Renderer2, inject} from '@angular/core';
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

  private renderer = inject(Renderer2);

  constructor() {
    this.appliquerTheme();
  }

  // Change le mode (Sombre/Clair)
  setMode(isSombre: boolean) {
    this.modeSombre = isSombre;
    this.appliquerTheme();
  }

  // Applique le thème à toute l'application
  appliquerTheme() {
    if (this.modeSombre) {
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
    }
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
