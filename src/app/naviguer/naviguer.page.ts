import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Bddfilms, FiltresRecherche, ResultatRecherche } from '../bdd/bddfilms.service';
import { UnFilm } from '../bdd/unFilm';
import { GENRES_MAP } from '../bdd/bddfilms.service';

@Component({
  selector: 'app-naviguer',
  templateUrl: 'naviguer.page.html',
  styleUrls: ['naviguer.page.scss'],
  standalone: false,
})
export class NaviguerPage implements OnInit {
  formulaireRecherche!: FormGroup;
  termeRecherche: string = '';
  listeResultats: UnFilm[] = [];
  totalResultatsFiltres: number = 0; // Changé: total réel avec filtres
  chargementEnCours: boolean = false;
  afficherFiltres: boolean = false;
  pageActuelle: number = 1;
  totalPages: number = 1;
  aPlusDeResultats: boolean = true;
  tailleLot: number = 50;
  nombrePagesParLot: number = 3;

  // Filtres actifs
  filtresActifs: FiltresRecherche = {
    tri: 'titre_az',
    statut: 'tous',
    type: 'tous',
    favoris: 'tous',
    sortie: 'deja_sorti',
    genres: []
  };

  // Copie temporaire des filtres pour l'édition
  filtresTemp: FiltresRecherche = { ...this.filtresActifs };

  // Liste des filtres pour l'affichage
  listeFiltresAffichage: { key: string, valeur: string }[] = [];

  private destroyRef = inject(DestroyRef);
  private abonnementRecherche!: Subscription;

  constructor(
    private constructeurFormulaire: FormBuilder,
    private bddFilms: Bddfilms,
    private detecteurChangements: ChangeDetectorRef,
    private router: Router
  ) {
    this.formulaireRecherche = this.constructeurFormulaire.group({
      texteRecherche: ['']
    });
  }

  ngOnInit() {
    this.effectuerRecherche();
  }

  onRechercher() {
    this.termeRecherche = this.formulaireRecherche.value.texteRecherche;
    this.reinitialiserRecherche();
    this.effectuerRecherche();
  }

  reinitialiserRecherche() {
    this.listeResultats = [];
    this.totalResultatsFiltres = 0;
    this.pageActuelle = 1;
    this.aPlusDeResultats = true;
  }

  ouvrirFiltres() {
    this.filtresTemp = JSON.parse(JSON.stringify(this.filtresActifs));
    this.afficherFiltres = true;
  }

  fermerFiltres() {
    this.afficherFiltres = false;
  }

  appliquerFiltresTemp(filtres: FiltresRecherche) {
    this.filtresTemp = filtres;
  }

  validerFiltres() {
    this.filtresActifs = JSON.parse(JSON.stringify(this.filtresTemp));
    this.reinitialiserRecherche();
    this.effectuerRecherche();
    this.fermerFiltres();
  }

  reinitialiserFiltresTemp() {
    this.filtresTemp = {
      tri: 'titre_az',
      statut: 'tous',
      type: 'tous',
      favoris: 'tous',
      sortie: 'deja_sorti',
      genres: []
    };
  }

  appliquerTri() {
    this.listeResultats = this.bddFilms.trierResultats(this.listeResultats, this.filtresActifs.tri);
    this.detecteurChangements.detectChanges();
  }

  effectuerRecherche() {
    if (this.chargementEnCours || !this.aPlusDeResultats) return;

    this.chargementEnCours = true;
    this.mettreAJourAffichageFiltres();

    if (this.abonnementRecherche) {
      this.abonnementRecherche.unsubscribe();
    }

    const pagesACharger = Math.min(this.nombrePagesParLot, this.totalPages - this.pageActuelle + 1);
    const requetes: Observable<ResultatRecherche>[] = [];

    for (let i = 0; i < pagesACharger; i++) {
      const page = this.pageActuelle + i;
      requetes.push(this.bddFilms.rechercherAvecFiltres(this.termeRecherche, this.filtresActifs, page));
    }

    Promise.all(requetes.map(r => r.toPromise())).then(resultats => {
      let tousLesResultats: UnFilm[] = [];
      let premierTotal = 0;

      resultats.forEach((resultat, index) => {
        if (index === 0) {
          premierTotal = resultat!.total;
          this.totalPages = resultat!.totalPages;
        }
        tousLesResultats = [...tousLesResultats, ...resultat!.resultats];
      });

      // Mettre à jour le total des résultats avec filtres
      if (this.pageActuelle === 1) {
        this.totalResultatsFiltres = premierTotal;
      }

      // Ajouter les nouveaux résultats
      const nouveauxResultats = [...this.listeResultats, ...tousLesResultats];
      this.listeResultats = nouveauxResultats;

      // Appliquer le tri
      this.appliquerTri();

      // Mettre à jour l'état de pagination
      this.pageActuelle += pagesACharger;
      this.aPlusDeResultats = this.pageActuelle <= this.totalPages && tousLesResultats.length > 0;

      this.chargementEnCours = false;
      this.detecteurChangements.detectChanges();

      console.log(`Total avec filtres: ${this.totalResultatsFiltres} | Affichés: ${this.listeResultats.length} | Page: ${this.pageActuelle - 1}/${this.totalPages}`);
    }).catch(erreur => {
      console.error('Erreur lors de la recherche:', erreur);
      this.chargementEnCours = false;
      this.detecteurChangements.detectChanges();
    });
  }

  chargerPlus() {
    if (!this.chargementEnCours && this.aPlusDeResultats) {
      this.effectuerRecherche();
    }
  }

  mettreAJourAffichageFiltres() {
    const filtresMap: { [key: string]: string } = {
      tri: this.getLibelleTri(),
      statut: this.getLibelleStatut(),
      type: this.getLibelleType(),
      favoris: this.getLibelleFavoris(),
      sortie: this.getLibelleSortie(),
      genres: this.getLibelleGenres()
    };

    this.listeFiltresAffichage = Object.entries(filtresMap)
      .filter(([_, valeur]) => valeur && valeur !== '' && valeur !== 'Tous')
      .map(([key, valeur]) => ({ key, valeur }));
  }

  getLibelleTri(): string {
    const triMap: { [key: string]: string } = {
      'titre_az': 'Titre A/Z',
      'titre_za': 'Titre Z/A',
      'note': 'Note',
      'ajout': 'Ajout',
      'popularite': 'Popularité',
      'recent': 'Récent'
    };
    return triMap[this.filtresActifs.tri] || 'Titre A/Z';
  }

  getLibelleStatut(): string {
    const statutMap: { [key: string]: string } = {
      'tous': 'Tous',
      'non_vu': 'Non vu',
      'en_cours': 'En cours',
      'termine': 'Terminé',
      'a_voir': 'À voir'
    };
    return statutMap[this.filtresActifs.statut] || 'Tous';
  }

  getLibelleType(): string {
    const typeMap: { [key: string]: string } = {
      'tous': 'Tous',
      'films': 'Films',
      'series': 'Séries'
    };
    return typeMap[this.filtresActifs.type] || 'Tous';
  }

  getLibelleFavoris(): string {
    const favorisMap: { [key: string]: string } = {
      'tous': 'Tous',
      'favoris': 'Favoris',
      'non_favoris': 'Non favoris'
    };
    return favorisMap[this.filtresActifs.favoris] || 'Tous';
  }

  getLibelleSortie(): string {
    const sortieMap: { [key: string]: string } = {
      'deja_sorti': 'Déjà sorti',
      'prochainement': 'Prochainement',
      'tous': ''
    };
    return sortieMap[this.filtresActifs.sortie] || '';
  }

  getLibelleGenres(): string {
    if (this.filtresActifs.genres.length === 0) return '';
    if (this.filtresActifs.genres.length === 1) {
      return GENRES_MAP[this.filtresActifs.genres[0]] || 'Genre';
    }
    return `${this.filtresActifs.genres.length} genres`;
  }

  voirDetails(oeuvre: UnFilm) {
    if (oeuvre.type === 'film') {
      console.log('Voir détails film:', oeuvre.id);
    } else {
      console.log('Voir détails série:', oeuvre.id);
    }
  }

  ngOnDestroy() {
    if (this.abonnementRecherche) this.abonnementRecherche.unsubscribe();
  }
}
