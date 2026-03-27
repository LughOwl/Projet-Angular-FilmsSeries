import { Component, OnInit, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    tri: 'popularite',
    statut: 'tous',
    type: 'tous',
    favoris: 'tous'
  };

  // Copie temporaire dans la modale (avant validation)
  filtresTemp: FiltresRecherche = { ...this.filtresActifs };

  // Pilules affichées sous la barre de recherche
  listeFiltresAffichage: { key: string, valeur: string }[] = [];

  // Pour le placeholder qui disparaît au clic
  placeholderVide: boolean = false;

  // Injections
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private api = inject(StockageFilmAPI);
  private local = inject(StockageFilmLocal);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.formulaireRecherche = this.fb.group({
      texteRecherche: ['']
    });

    // Récupérer les queryParams
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      let besoinReinitialisation = false;

      // Réinitialiser tous les filtres
      let nouveauxFiltres = { ...this.filtresActifs };

      // Gestion du statut - Si présent, on réinitialise favoris
      if (params['statut'] && params['statut'] !== this.filtresActifs.statut) {
        if (params['statut'] === 'en_cours' || params['statut'] === 'a_voir' || params['statut'] === 'termine') {
          nouveauxFiltres.statut = params['statut'];
          // Si on applique un statut, on désactive favoris
          nouveauxFiltres.favoris = 'tous';
          besoinReinitialisation = true;
        }
      } else if (!params['statut'] && this.filtresActifs.statut !== 'tous') {
        // Si le paramètre statut n'est pas dans l'URL mais qu'il est actif, on le réinitialise
        nouveauxFiltres.statut = 'tous';
        besoinReinitialisation = true;
      }

      // Gestion du type
      if (params['type'] && params['type'] !== this.filtresActifs.type) {
        if (params['type'] === 'films' || params['type'] === 'series') {
          nouveauxFiltres.type = params['type'];
          besoinReinitialisation = true;
        }
      } else if (!params['type'] && this.filtresActifs.type !== 'tous') {
        // Si le paramètre type n'est pas dans l'URL mais qu'il est actif, on le réinitialise
        nouveauxFiltres.type = 'tous';
        besoinReinitialisation = true;
      }

      // Gestion des favoris - Si présent, on réinitialise statut
      if (params['favoris'] && params['favoris'] !== this.filtresActifs.favoris) {
        if (params['favoris'] === 'favoris') {
          nouveauxFiltres.favoris = 'favoris';
          // Si on applique favoris, on désactive statut
          nouveauxFiltres.statut = 'tous';
          besoinReinitialisation = true;
        }
      } else if (!params['favoris'] && this.filtresActifs.favoris !== 'tous') {
        // Si le paramètre favoris n'est pas dans l'URL mais qu'il est actif, on le réinitialise
        nouveauxFiltres.favoris = 'tous';
        besoinReinitialisation = true;
      }

      if (besoinReinitialisation) {
        this.filtresActifs = nouveauxFiltres;
        this.filtresTemp = { ...this.filtresActifs };
        this.mettreAJourFiltresAffichage();

        // Réinitialiser et relancer la recherche
        this.reinitialiserResultats();
        this.effectuerRecherche();
      }
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

    // Recherche locale uniquement si :
    // 1. Un statut spécifique est sélectionné (en_cours, a_voir, termine)
    // 2. OU si on cherche les favoris
    const rechercheLocale =
      this.filtresActifs.statut !== 'tous' ||
      this.filtresActifs.favoris === 'favoris';

    if (rechercheLocale) {
      this.rechercherEnLocal(terme);
    } else {
      // Si type est spécifié, on le passe à l'API
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
    // Mettre à jour l'URL avec les nouveaux filtres
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        statut: this.filtresActifs.statut !== 'tous' ? this.filtresActifs.statut : null,
        type: this.filtresActifs.type !== 'tous' ? this.filtresActifs.type : null,
        favoris: this.filtresActifs.favoris !== 'tous' ? this.filtresActifs.favoris : null
      },
      queryParamsHandling: 'merge'
    });
    this.reinitialiserResultats();
    this.effectuerRecherche();
    this.fermerFiltres();
  }

  reinitialiserFiltresTemp() {
    this.filtresTemp = {
      tri: 'popularite',
      statut: 'tous',
      type: 'tous',
      favoris: 'tous'
    };
  }

  reinitialiserFiltres() {
    this.filtresActifs = {
      tri: 'popularite',
      statut: 'tous',
      type: 'tous',
      favoris: 'tous'
    };
    this.filtresTemp = { ...this.filtresActifs };
    this.mettreAJourFiltresAffichage();

    // Réinitialiser l'URL
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        statut: null,
        type: null,
        favoris: null
      },
      queryParamsHandling: 'merge'
    });

    this.reinitialiserResultats();
    this.effectuerRecherche();
  }

  ouvrirAjouterOeuvre(){

  }

  // ─── NAVIGATION ──────────────────────────────────────────────────────────────

  voirDetails(oeuvre: Film | Serie) {
    this.router.navigate(['/detail-oeuvre'], { state: { oeuvre: oeuvre } });
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
      'popularite': 'Popularité',
      'titre_az': 'Titre A/Z',
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
