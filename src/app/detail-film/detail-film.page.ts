import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, IonModal } from '@ionic/angular'; // Import de IonModal
import { UnFilm } from "../modeles/unFilm";
import { StockageFilmLocal } from '../services/stockageFilmLocal';
import {StockageFilmAPI} from "../services/stockageFilmAPI";

@Component({
  selector: 'app-detail-film',
  templateUrl: './detail-film.page.html',
  styleUrls: ['./detail-film.page.scss'],
  standalone: false
})
export class DetailFilmPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal; // Pour pouvoir fermer le modal par code

  film!: UnFilm;
  estFavori: boolean = false;
  statutActuel: string = 'non_vu';
  noteActuelle: number = 0;
  heures: number = 0;
  minutes: number = 0;

  // Variables temporaires liées au [(ngModel)] dans le HTML
  noteTemp: number = 0;
  statutTemp: string = 'non_vu';
  heuresTemp: number = 0;
  minutesTemp: number = 0;

  private router = inject(Router);
  private navCtrl = inject(NavController);
  private stockageFilm = inject(StockageFilmLocal);
  private stockageFilmAPI = inject(StockageFilmAPI); // --- INJECTION DU SERVICE API ---

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.film = navigation.extras.state['film'];
      this.verifierEtatInitial();
    }
  }

  voirBandeAnnonce() {
    if (!this.film.id) return;
    // Correction du nom de la variable (stockageFilmAPI au lieu de bddFilms)
    this.stockageFilmAPI.obtenirBandeAnnonce(this.film.id).subscribe(url => {
      if (url) {
        window.open(url, '_blank');
      } else {
        alert("Bande-annonce non disponible.");
      }
    });
  }

  // --- LOGIQUE DE NAVIGATION ---
  retourner() { this.navCtrl.back(); }

  // --- LOGIQUE DU MODAL ---
  initialiserTemp() {
    this.noteTemp = this.noteActuelle;
    this.statutTemp = this.statutActuel;
    this.heuresTemp = this.heures;
    this.minutesTemp = this.minutes;
  }

  setNoteTemp(val: number) { this.noteTemp = val; }

  setStatutTemp(val: string) { this.statutTemp = val; }

  transformStatut(label: string): string {
    return label.toLowerCase().replace(' ', '_');
  }

  validerSuivi() {
    this.statutActuel = this.statutTemp;
    this.noteActuelle = this.noteTemp;
    this.heures = this.heuresTemp;
    this.minutes = this.minutesTemp;
    this.sauvegarder();
    this.modal.dismiss();
  }

  fermerModal() { this.modal.dismiss(); }

  // --- PERSISTENCE ---
  verifierEtatInitial() {
    const collection = JSON.parse(localStorage.getItem('mes_films_data') || '[]');
    const cineData = collection.find((item: any) => item.id === this.film.id);
    if (cineData) {
      this.estFavori = cineData.favori || false;
      this.statutActuel = cineData.statut || 'non_vu';
      this.noteActuelle = cineData.note || 0;
      this.heures = cineData.heures || 0;
      this.minutes = cineData.minutes || 0;
    }
  }

  toggleFavori() {
    this.estFavori = !this.estFavori;
    this.sauvegarder();
  }

  sauvegarder() {
    this.stockageFilm.modifierFilm(this.film, this.statutActuel, this.estFavori, this.noteActuelle, this.heures, this.minutes);
  }
}
