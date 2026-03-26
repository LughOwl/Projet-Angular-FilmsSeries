import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FiltresRecherche } from '../bdd/bddfilms.service';

@Component({
  selector: 'app-filtres-recherche',
  templateUrl: './filtres-recherche.component.html',
  styleUrls: ['./filtres-recherche.component.scss'],
  standalone: false,
})
export class FiltresRechercheComponent {
  @Input() filtres!: FiltresRecherche;
  @Output() filtresChange = new EventEmitter<FiltresRecherche>();
  @Output() validerClick = new EventEmitter<void>();
  @Output() reinitialiserClick = new EventEmitter<void>();

  // Options pour chaque catégorie
  optionsTri = [
    { valeur: 'titre_az', label: 'Titre A/Z' },
    { valeur: 'titre_za', label: 'Titre Z/A' },
    { valeur: 'note', label: 'Note +/-' },
    { valeur: 'ajout', label: 'Ajout +/-' },
    { valeur: 'popularite', label: 'Popularité +/-' },
    { valeur: 'recent', label: 'Récent +/-' }
  ];

  optionsStatut = [
    { valeur: 'tous', label: 'Tous' },
    { valeur: 'non_vu', label: 'Non vu' },
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
    { valeur: 'favoris', label: 'Favoris' },
    { valeur: 'non_favoris', label: 'Non favoris' }
  ];

  optionsSortie = [
    { valeur: 'deja_sorti', label: 'Déjà sorti' },
    { valeur: 'prochainement', label: 'Prochainement' },
    { valeur: 'tous', label: 'Tous' }
  ];

  optionsGenres = [
    { id: 28, nom: 'Action' },
    { id: 12, nom: 'Aventure' },
    { id: 16, nom: 'Animation' },
    { id: 35, nom: 'Comédie' },
    { id: 80, nom: 'Crime' },
    { id: 99, nom: 'Documentaire' },
    { id: 18, nom: 'Drame' },
    { id: 10751, nom: 'Familial' },
    { id: 14, nom: 'Fantastique' },
    { id: 36, nom: 'Histoire' },
    { id: 27, nom: 'Horreur' },
    { id: 10402, nom: 'Musique' },
    { id: 9648, nom: 'Mystère' },
    { id: 10749, nom: 'Romance' },
    { id: 878, nom: 'Science-fiction' },
    { id: 10770, nom: 'Téléfilm' },
    { id: 53, nom: 'Thriller' },
    { id: 10752, nom: 'Guerre' },
    { id: 37, nom: 'Western' }
  ];

  selectionnerTri(valeur: string) {
    this.filtres.tri = valeur as any;
    this.emettreChangement();
  }

  selectionnerStatut(valeur: string) {
    this.filtres.statut = valeur as any;
    this.emettreChangement();
  }

  selectionnerType(valeur: string) {
    this.filtres.type = valeur as any;
    this.emettreChangement();
  }

  selectionnerFavoris(valeur: string) {
    this.filtres.favoris = valeur as any;
    this.emettreChangement();
  }

  selectionnerSortie(valeur: string) {
    this.filtres.sortie = valeur as any;
    this.emettreChangement();
  }

  toggleGenre(id: number) {
    const index = this.filtres.genres.indexOf(id);
    if (index > -1) {
      this.filtres.genres.splice(index, 1);
    } else {
      this.filtres.genres.push(id);
    }
    this.emettreChangement();
  }

  estGenreSelectionne(id: number): boolean {
    return this.filtres.genres.includes(id);
  }

  valider() {
    this.validerClick.emit();
  }

  reinitialiser() {
    this.filtres = {
      tri: 'titre_az',
      statut: 'tous',
      type: 'tous',
      favoris: 'tous',
      sortie: 'deja_sorti',
      genres: []
    };
    this.reinitialiserClick.emit();
    this.emettreChangement();
  }

  private emettreChangement() {
    this.filtresChange.emit({ ...this.filtres });
  }
}
