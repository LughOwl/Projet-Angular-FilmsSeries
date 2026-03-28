import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { Share } from '@capacitor/share';
import { Router } from '@angular/router';
import { NavController, IonModal } from '@ionic/angular';
import { Film } from "../modeles/film";
import { Serie } from "../modeles/serie";
import { StockageOeuvreLocal } from '../services/stockageOeuvreLocal';
import { StockageOeuvreAPI } from "../services/stockageOeuvreAPI";

@Component({
  selector: 'app-detail-oeuvre',
  templateUrl: './detail-oeuvre.page.html',
  styleUrls: ['./detail-oeuvre.page.scss'],
  standalone: false
})
export class DetailOeuvrePage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  oeuvre!: Film | Serie;
  estFavori: boolean = false;
  statutActuel: string = 'non_vu';
  noteActuelle: number = 0;

  // Pour les films
  heures: number = 0;
  minutes: number = 0;
  dureeFilmTotale: number = 0;

  // Pour les séries
  saison: number = 0;
  episode: number = 0;
  saisonTotal: number = 0;
  episodeTotal: number = 0;

  // Variables temporaires
  noteTemp: number = 0;
  statutTemp: string = 'non_vu';
  heuresTemp: number = 0;
  minutesTemp: number = 0;
  saisonTemp: number = 0;
  episodeTemp: number = 0;

  // Détails supplémentaires (API)
  public genres: string = '';
  public realisateur: string = '';
  public acteurs: string = '';

  // Propriété publique pour le template
  public estFilm: boolean = true;

  private router = inject(Router);
  private navCtrl = inject(NavController);
  private stockageFilm = inject(StockageOeuvreLocal);
  private stockageFilmAPI = inject(StockageOeuvreAPI);

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.oeuvre = navigation.extras.state['oeuvre'];
      this.estFilm = this.oeuvre.type === 'film';
      this.verifierEtatInitial();
      this.chargerDetailsSupplementaires();
    }
  }

  chargerDetailsSupplementaires() {
    if (this.estFilm) {
      if (this.dureeFilmTotale > 0) {
        return;
      }
      this.stockageFilmAPI.getFilmDetails(this.oeuvre.id).subscribe({
        next: (details) => {
          this.dureeFilmTotale = details.runtime || 0;
          this.genres = details.genres?.map((g: any) => g.name).join(', ') || '';
          this.realisateur = details.credits?.crew?.find((c: any) => c.job === 'Director')?.name || '';
          this.acteurs = details.credits?.cast?.slice(0, 3).map((a: any) => a.name).join(', ') || '';
        },
        error: (err) => console.error('Erreur chargement détails film:', err)
      });
    } else {
      if (this.saisonTotal > 0) {
        return;
      }
      this.stockageFilmAPI.getSerieDetails(this.oeuvre.id).subscribe({
        next: (details) => {
          this.saisonTotal = details.number_of_seasons || 0;
          this.episodeTotal = details.number_of_episodes || 0;
          this.genres = details.genres?.map((g: any) => g.name).join(', ') || '';
          this.realisateur = details.created_by?.map((c: any) => c.name).join(', ') || '';
          this.acteurs = details.credits?.cast?.slice(0, 3).map((a: any) => a.name).join(', ') || '';
        },
        error: (err) => console.error('Erreur chargement détails série:', err)
      });
    }
  }

  async partagerOeuvre() {
    const typeUrl = this.estFilm ? 'movie' : 'tv';
    const tmdbUrl = `https://www.themoviedb.org/${typeUrl}/${this.oeuvre.id}`;

    let message = ` ${this.oeuvre.titre}\n`;
    message += ` Note : ${this.noteActuelle}/5\n`;
    message += ` Statut : ${this.statutActuel.replace('_', ' ')}\n`;

    if (this.statutActuel === 'en_cours') {
      message += this.estFilm
        ? ` Progression : ${this.heures}h${this.minutes | 0}min\n`
        : ` Progression : Saison ${this.saison}, Épisode ${this.episode}\n`;
    }

    message += `\nLien TMDB : ${tmdbUrl}`;

    try {
      await Share.share({
        title: this.oeuvre.titre,
        text: message,
        dialogTitle: 'Partager l\'oeuvre',
      });
    } catch (error) {
      console.error('Erreur lors du partage :', error);
    }
  }

  voirBandeAnnonce() {
    if (!this.oeuvre.id) return;
    this.stockageFilmAPI.obtenirBandeAnnonce(this.oeuvre.id).subscribe(url => {
      if (url) {
        window.open(url, '_blank');
      } else {
        alert("Bande-annonce non disponible.");
      }
    });
  }

  retourner() {
    this.navCtrl.back();
  }

  initialiserTemp() {
    this.noteTemp = this.noteActuelle;
    this.statutTemp = this.statutActuel;

    if (this.estFilm) {
      this.heuresTemp = this.heures;
      this.minutesTemp = this.minutes;
    } else {
      this.saisonTemp = this.saison;
      this.episodeTemp = this.episode;
    }
  }

  setNoteTemp(val: number) {
    this.noteTemp = val;
  }

  setStatutTemp(val: string) {
    this.statutTemp = val;
  }

  transformStatut(label: string): string {
    const statutMap: { [key: string]: string } = {
      'non vu': 'non_vu',
      'en cours': 'en_cours',
      'terminé': 'termine',
      'à voir': 'a_voir'
    };
    const key = label.toLowerCase();
    return statutMap[key] || key.replace(' ', '_');
  }

  validerSuivi() {
    this.statutActuel = this.statutTemp;
    this.noteActuelle = this.noteTemp;

    if (this.estFilm) {
      this.heures = this.heuresTemp;
      this.minutes = this.minutesTemp;

      this.stockageFilm.modifierFilm(
        this.oeuvre as Film,
        this.statutActuel,
        this.oeuvre.estFavori,
        this.noteActuelle,
        this.heures,
        this.minutes
      );
    } else {
      this.saison = this.saisonTemp;
      this.episode = this.episodeTemp;

      this.stockageFilm.modifierSerie(
        this.oeuvre as Serie,
        this.statutActuel,
        this.oeuvre.estFavori,
        this.noteActuelle,
        this.saison,
        this.episode
      );
    }

    this.sauvegarder();
    this.modal.dismiss();
  }

  fermerModal() {
    this.modal.dismiss();
  }

  verifierEtatInitial() {
    const collection = JSON.parse(localStorage.getItem('mes_films_data') || '[]');
    const data = collection.find((item: any) => item.id === this.oeuvre.id);

    if (data) {
      this.statutActuel = data.statut || 'non_vu';
      this.noteActuelle = data.note || 0;

      if (this.estFilm) {
        this.heures = data.heures || 0;
        this.minutes = data.minutes || 0;
        this.dureeFilmTotale = data.dureeTotale || 0;
      } else {
        this.saison = data.saison || 0;
        this.episode = data.episode || 0;
        this.saisonTotal = data.nbSaisonsTotal || 0;
        this.episodeTotal = data.nbEpisodesTotal || 0;
      }

      if (!this.oeuvre.apercu || this.oeuvre.apercu === 'Aucune description disponible.') {
        this.oeuvre = this.estFilm ? new Film(data) : new Serie(data);
      }
    }
  }

  toggleFavori() {
    const nouvelEtat = !this.oeuvre.estFavori;
    this.sauvegarderFavoriDirect(nouvelEtat);
  }

  sauvegarderFavoriDirect(etat: boolean) {
    if (this.estFilm) {
      this.stockageFilm.modifierFilm(
        this.oeuvre as Film,
        this.statutActuel,
        etat,
        this.noteActuelle,
        this.heures,
        this.minutes
      );
    } else {
      this.stockageFilm.modifierSerie(
        this.oeuvre as Serie,
        this.statutActuel,
        etat,
        this.noteActuelle,
        this.saison,
        this.episode
      );
    }
  }

  sauvegarder() {
    if (this.estFilm) {
      this.stockageFilm.modifierFilm(
        this.oeuvre as Film,
        this.statutActuel,
        this.oeuvre.estFavori,
        this.noteActuelle,
        this.heures,
        this.minutes
      );
    } else {
      this.stockageFilm.modifierSerie(
        this.oeuvre as Serie,
        this.statutActuel,
        this.oeuvre.estFavori,
        this.noteActuelle,
        this.saison,
        this.episode
      );
    }
  }

  verifierMinutes() {
    if (this.minutesTemp > 59) {
      this.minutesTemp = 59;
    }
    if (this.minutesTemp < 0) {
      this.minutesTemp = 0;
    }
  }
}
