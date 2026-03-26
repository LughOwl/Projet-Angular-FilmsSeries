import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Bddfilms } from '../bdd/bddfilms.service';
import { UnFilm } from '../bdd/unFilm';
import { Router } from '@angular/router';

export interface FilmUtilisateur {
  film: UnFilm;
  statut: 'en_cours' | 'a_voir' | 'termine' | 'non_vu';
  estFavori: boolean;
  dateAjout: Date;
  progression?: string;
}

@Component({
  selector: 'app-films',
  templateUrl: './films.page.html',
  styleUrls: ['./films.page.scss'],
  standalone: false,
})
export class FilmsPage implements OnInit {
  // Listes pour chaque catégorie (attention aux noms !)
  listeEnCours: UnFilm[] = [];
  listeAVoir: UnFilm[] = [];
  listeSuggestions: UnFilm[] = [];      // ← nom exact
  listeFavoris: UnFilm[] = [];
  listeTermine: UnFilm[] = [];
  listeAVenir: UnFilm[] = [];           // ← nom exact

  // États de chargement
  chargementEnCours: boolean = true;
  chargementAVoir: boolean = true;
  chargementSuggestions: boolean = true;
  chargementFavoris: boolean = true;
  chargementTermine: boolean = true;
  chargementAVenir: boolean = true;

  // Injection avec la fonction inject()
  private destroyRef = inject(DestroyRef);
  private bddFilms = inject(Bddfilms);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  private abonnementFilms!: Subscription;
  private collectionUtilisateur: FilmUtilisateur[] = [];

  ngOnInit() {
    this.chargerFilms();
    this.chargerCollectionUtilisateur();
  }

  chargerCollectionUtilisateur() {
    this.collectionUtilisateur = [];
  }

  chargerFilms() {
    this.chargementSuggestions = true;
    this.chargementAVenir = true;

    // Utiliser la bonne méthode : getFilmsPopulaires()
    this.abonnementFilms = this.bddFilms.getFilmsPopulaires()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (films: UnFilm[]) => {
          this.listeSuggestions = films.slice(0, 10);
          this.chargementSuggestions = false;

          this.listeAVenir = films.slice(10, 15);
          this.chargementAVenir = false;

          this.cdr.detectChanges();
          console.log(`${films.length} films chargés pour suggestions`);
        },
        error: (erreur: any) => {
          console.error('Erreur chargement films:', erreur);
          this.chargementSuggestions = false;
          this.chargementAVenir = false;
          this.cdr.detectChanges();
        }
      });

    this.actualiserListesUtilisateur();
  }

  actualiserListesUtilisateur() {
    this.listeEnCours = this.collectionUtilisateur
      .filter(item => item.statut === 'en_cours')
      .sort((a, b) => b.dateAjout.getTime() - a.dateAjout.getTime())
      .map(item => item.film);
    this.chargementEnCours = false;

    this.listeAVoir = this.collectionUtilisateur
      .filter(item => item.statut === 'a_voir')
      .sort((a, b) => b.dateAjout.getTime() - a.dateAjout.getTime())
      .map(item => item.film);
    this.chargementAVoir = false;

    this.listeTermine = this.collectionUtilisateur
      .filter(item => item.statut === 'termine')
      .sort((a, b) => b.dateAjout.getTime() - a.dateAjout.getTime())
      .map(item => item.film);
    this.chargementTermine = false;

    this.listeFavoris = this.collectionUtilisateur
      .filter(item => item.estFavori)
      .sort((a, b) => b.dateAjout.getTime() - a.dateAjout.getTime())
      .map(item => item.film);
    this.chargementFavoris = false;

    this.cdr.detectChanges();
  }

  voirDetail(film: UnFilm) {
    this.router.navigate(['/detail-film', film.titre]);
  }

  naviguerVersRecherche(filtres: any) {
    this.router.navigate(['/tabs/naviguer'], { state: { filtres } });
  }

  ngOnDestroy() {
    if (this.abonnementFilms) {
      this.abonnementFilms.unsubscribe();
    }
  }
}
