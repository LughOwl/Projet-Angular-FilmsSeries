import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FiltresRecherche } from '../modeles/filtresRecherche';

@Component({
  selector: 'app-filtres-recherche',
  templateUrl: './filtres-recherche.component.html',
  styleUrls: ['./filtres-recherche.component.scss'],
  standalone: false,
})
export class FiltresRechercheComponent {
  // Reçoit les filtres depuis la page parente
  @Input() filtres!: FiltresRecherche;

  // Envoie les filtres modifiés au parent
  @Output() filtresChange = new EventEmitter<FiltresRecherche>();
  @Output() validerClick = new EventEmitter<void>();
  @Output() reinitialiserClick = new EventEmitter<void>();

  optionsTri = [
    { valeur: 'popularite', label: 'Popularité' },
    { valeur: 'titre_az', label: 'Titre A/Z' }
  ];

  optionsStatut = [
    { valeur: 'tous', label: 'Tous' },
    { valeur: 'en_cours', label: 'En cours' },
    { valeur: 'termine', label: 'Terminé' },
    { valeur: 'a_voir', label: 'À voir' }
  ];

  optionsType = [
    { valeur: 'tous', label: 'Tous' },
    { valeur: 'films', label: 'Films' },
    { valeur: 'series', label: 'Séries' }
  ];

  optionsFavoris = [
    { valeur: 'tous', label: 'Tous' },
    { valeur: 'favoris', label: 'Favoris' }
  ];

  selectionnerTri(valeur: string) {
    this.filtres.tri = valeur as FiltresRecherche['tri'];
    this.emettreChangement();
  }

  selectionnerStatut(valeur: string) {
    this.filtres.statut = valeur as FiltresRecherche['statut'];
    this.emettreChangement();
  }

  selectionnerType(valeur: string) {
    this.filtres.type = valeur as FiltresRecherche['type'];
    this.emettreChangement();
  }

  selectionnerFavoris(valeur: string) {
    this.filtres.favoris = valeur as FiltresRecherche['favoris'];
    this.emettreChangement();
  }

  valider() {
    this.validerClick.emit();
  }

  reinitialiser() {
    this.filtres = { tri: 'popularite', statut: 'tous', type: 'tous', favoris: 'tous' };
    this.reinitialiserClick.emit();
    this.emettreChangement();
  }

  private emettreChangement() {
    this.filtresChange.emit({ ...this.filtres });
  }
}
