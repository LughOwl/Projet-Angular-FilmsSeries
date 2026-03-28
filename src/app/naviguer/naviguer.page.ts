import { Component, OnInit, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Film } from '../modeles/film';
import { Serie } from '../modeles/serie';
import { FiltresRecherche, ResultatRecherche } from '../modeles/filtresRecherche';
import { StockageOeuvreAPI } from '../services/stockageOeuvreAPI';
import { StockageOeuvreLocal } from '../services/stockageOeuvreLocal';

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

  pageActuelle: number = 1;
  totalPages: number = 1;
  aPlusDeResultats: boolean = true;

  filtresActifs: FiltresRecherche = {
    tri: 'popularite',
    statut: 'tous',
    type: 'tous',
    favoris: 'tous'
  };

  filtresTemp: FiltresRecherche = { ...this.filtresActifs };

  listeFiltresAffichage: { key: string, valeur: string }[] = [];

  placeholderVide: boolean = false;

  afficherAjoutOeuvre: boolean = false;

  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private api = inject(StockageOeuvreAPI);
  private local = inject(StockageOeuvreLocal);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.formulaireRecherche = this.fb.group({
      texteRecherche: ['']
    });

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      let besoinReinitialisation = false;

      let nouveauxFiltres = { ...this.filtresActifs };

      if (params['statut'] && params['statut'] !== this.filtresActifs.statut) {
        if (params['statut'] === 'en_cours' || params['statut'] === 'a_voir' || params['statut'] === 'termine') {
          nouveauxFiltres.statut = params['statut'];
          nouveauxFiltres.favoris = 'tous';
          besoinReinitialisation = true;
        }
      } else if (!params['statut'] && this.filtresActifs.statut !== 'tous') {
        nouveauxFiltres.statut = 'tous';
        besoinReinitialisation = true;
      }

      if (params['type'] && params['type'] !== this.filtresActifs.type) {
        if (params['type'] === 'films' || params['type'] === 'series') {
          nouveauxFiltres.type = params['type'];
          besoinReinitialisation = true;
        }
      } else if (!params['type'] && this.filtresActifs.type !== 'tous') {
        nouveauxFiltres.type = 'tous';
        besoinReinitialisation = true;
      }

      if (params['favoris'] && params['favoris'] !== this.filtresActifs.favoris) {
        if (params['favoris'] === 'favoris') {
          nouveauxFiltres.favoris = 'favoris';
          nouveauxFiltres.statut = 'tous';
          besoinReinitialisation = true;
        }
      } else if (!params['favoris'] && this.filtresActifs.favoris !== 'tous') {
        nouveauxFiltres.favoris = 'tous';
        besoinReinitialisation = true;
      }

      if (besoinReinitialisation) {
        this.filtresActifs = nouveauxFiltres;
        this.filtresTemp = { ...this.filtresActifs };
        this.mettreAJourFiltresAffichage();

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


    const rechercheLocale =
      this.filtresActifs.statut !== 'tous' ||
      this.filtresActifs.favoris === 'favoris';

    if (rechercheLocale) {
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

  ouvrirAjouterOeuvre() {
    this.afficherAjoutOeuvre = true;
  }

  fermerAjoutOeuvre() {
    this.afficherAjoutOeuvre = false;
  }

  validerAjoutOeuvre() {
    this.afficherAjoutOeuvre = false;
    // Réinitialiser la recherche pour afficher la nouvelle œuvre
    this.reinitialiserResultats();
    this.effectuerRecherche();
  }


  voirDetails(oeuvre: Film | Serie) {
    this.router.navigate(['/detail-oeuvre'], { state: { oeuvre: oeuvre } });
  }


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
