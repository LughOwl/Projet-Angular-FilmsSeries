import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { UnFilm } from "../bdd/unFilm"; // Vérifie le chemin vers ton fichier
import { StockageFilm } from '../service/stockageFilm'; // Ton nouveau service

@Component({
  selector: 'app-detail-film',
  templateUrl: './detail-film.page.html',
  styleUrls: ['./detail-film.page.scss'],
  standalone: false
})
export class DetailFilmPage implements OnInit {
  film!: UnFilm;
  estFavori: boolean = false;
  statutActuel: string = 'non_vu';

  private router = inject(Router);
  private actionSheetCtrl = inject(ActionSheetController);
  private stockageFilm = inject(StockageFilm);

  ngOnInit() {
    // Récupération du film via le state du router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.film = navigation.extras.state['film'];
      this.verifierEtatInitial();
    }

    if (!this.film) {
      this.router.navigate(['/tabs/films']);
    }
  }

  // Vérifie si le film est déjà en favori ou a un statut dans le stockage
  verifierEtatInitial() {
    const collection = JSON.parse(localStorage.getItem('mes_films_data') || '[]');
    const cineData = collection.find((item: any) => item.id === this.film.id);
    if (cineData) {
      this.estFavori = cineData.favori;
      this.statutActuel = cineData.statut;
    }
  }

  toggleFavori() {
    this.estFavori = !this.estFavori;
    this.stockageFilm.modifierFilm(this.film, this.statutActuel, this.estFavori);
  }

  async ouvrirMenuStatut() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'STATUT DU FILM',
      buttons: [
        { text: 'En cours', icon: 'play-outline', handler: () => this.changerStatut('en_cours') },
        { text: 'À voir', icon: 'bookmark-outline', handler: () => this.changerStatut('a_voir') },
        { text: 'Terminé', icon: 'checkmark-done-outline', handler: () => this.changerStatut('termine') },
        { text: 'Annuler', role: 'cancel', icon: 'close' },
        { text: 'Supprimer du suivi',
          role: 'destructive',
          icon: 'trash-outline', handler: () => this.changerStatut('non_vu') // Le statut 'non_vu' servira à retirer le film
        },
      ]
    });
    await actionSheet.present();
  }

  changerStatut(nouveauStatut: string) {
    this.statutActuel = nouveauStatut;
    this.stockageFilm.modifierFilm(this.film, this.statutActuel, this.estFavori);
  }
}
