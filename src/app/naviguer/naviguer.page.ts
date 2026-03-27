import { Component, OnInit, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Film } from '../modeles/film';
import { Serie } from '../modeles/serie';
import { FiltresRecherche, ResultatRecherche } from '../modeles/filtresRecherche';
import { StockageFilmAPI } from '../services/stockageFilmAPI';
import { StockageFilmLocal } from '../services/stockageFilmLocal';

@Component({
  selector: 'app-naviguer',
  templateUrl: 'naviguer.page.html',
  styleUrls: ['naviguer.page.scss'],
  standalone: false,
})
export class NaviguerPage implements OnInit {
  formulaireRecherche!: FormGroup;

  listeResultats: (Film | Serie)[] = [];
  totalResultatsFiltres: number = 0;
  chargementEnCours: boolean = false;
  afficherFiltres: boolean = false;

  // Pagination
  pageActuelle: number = 1;
  totalPages: number = 1;
  aPlusDeResultats: boolean = true;

  // Filtres appliqués
  filtresActifs: FiltresRecherche = {
    tri: 'titre_az',
    statut: 'tous',
    type: 'tous',
    favoris: 'tous'
  };

  // Copie temporaire dans la modale (avant validation)
  filtresTemp: FiltresRecherche = { ...this.filtresActifs };

  // Pillules affichées sous la barre de recherche
  listeFiltresAffichage: { key: string, valeur: string }[] = [];

  // Injections
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private api = inject(StockageFilmAPI);
  private local = inject(StockageFilmLocal);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.formulaireRecherche = this.fb.group({
      texteRecherche: ['']
    });
    this.effectuerRecherche();
  }

  // ─── RECHERCHE ───────────────────────────────────────────────────────────────

  onRechercher() {
    this.reinitialiserResultats();
    this.effectuerRecherche();
  }

  effectuerRecherche() {
    if (this.chargementEnCours) return;

    const terme = this.formulaireRecherche.value.texteRecherche || '';
    this.chargementEnCours = true;
    this.mettreAJourFiltresAffichage();

    // Statut spécifique ou favoris → stockage local
    if (this.filtresActifs.statut !== 'tous' || this.filtresActifs.favoris === 'favoris') {
      this.rechercherEnLocal(terme);
    } else {
      this.rechercherSurAPI(terme);
    }
  }

  private rechercherEnLocal(terme: string) {
    setTimeout(() => {
      const resultats = this.local.rechercherEnLocal(terme, this.filtresActifs);
      this.listeResultats = resultats;
      this.totalResultatsFiltres = resultats.length;
      this.aPlusDeResultats = false;
      this.chargementEnCours = false;
      this.cdr.detectChanges();
    }, 300);
  }

  private rechercherSurAPI(terme: string) {
    this.api.rechercherSurAPI(terme, this.filtresActifs, this.pageActuelle)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultat: ResultatRecherche) => {
          if (this.pageActuelle === 1) {
            this.totalResultatsFiltres = resultat.total;
            this.totalPages = resultat.totalPages;
          }

          if (this.pageActuelle === 1) {
            this.listeResultats = resultat.resultats;
          } else {
            this.listeResultats = [...this.listeResultats, ...resultat.resultats];
          }

          this.pageActuelle++;
          this.aPlusDeResultats = this.pageActuelle <= this.totalPages;
          this.chargementEnCours = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur lors de la recherche API:', err);
          this.chargementEnCours = false;
          this.cdr.detectChanges();
        }
      });
  }

  chargerPlus() {
    if (!this.chargementEnCours && this.aPlusDeResultats) {
      this.effectuerRecherche();
    }
  }

  // ─── FILTRES ─────────────────────────────────────────────────────────────────

  ouvrirFiltres() {
    this.filtresTemp = { ...this.filtresActifs };
    this.afficherFiltres = true;
  }

  fermerFiltres() {
    this.afficherFiltres = false;
  }

  appliquerFiltresTemp(filtres: FiltresRecherche) {
    this.filtresTemp = filtres;
  }

  validerFiltres() {
    this.filtresActifs = { ...this.filtresTemp };
    this.reinitialiserResultats();
    this.effectuerRecherche();
    this.fermerFiltres();
  }

  reinitialiserFiltresTemp() {
    this.filtresTemp = {
      tri: 'titre_az',
      statut: 'tous',
      type: 'tous',
      favoris: 'tous'
    };
  }

  // ─── NAVIGATION ──────────────────────────────────────────────────────────────

  voirDetails(oeuvre: Film | Serie) {
    this.router.navigate(['/detail-oeuvre'], { state: { oeuvre: oeuvre } }); // ← Changé
  }

  // ─── PRIVÉ ───────────────────────────────────────────────────────────────────

  private reinitialiserResultats() {
    this.listeResultats = [];
    this.totalResultatsFiltres = 0;
    this.pageActuelle = 1;
    this.aPlusDeResultats = true;
  }

  private mettreAJourFiltresAffichage() {
    const libelles: { [key: string]: string } = {
      'titre_az': 'Titre A/Z',
      'popularite': 'Popularité',
      'en_cours': 'En cours',
      'termine': 'Terminé',
      'a_voir': 'À voir',
      'films': 'Films',
      'series': 'Séries',
      'favoris': 'Favoris'
    };

    this.listeFiltresAffichage = Object.entries(this.filtresActifs)
      .filter(([key, valeur]) => valeur !== 'tous' && valeur !== '' && libelles[valeur])
      .map(([key, valeur]) => ({
        key: key,
        valeur: libelles[valeur] || valeur
      }));
  }
}
