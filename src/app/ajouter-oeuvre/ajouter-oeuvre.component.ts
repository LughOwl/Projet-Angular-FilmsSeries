import {Component, OnInit, EventEmitter, Output, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Film } from '../modeles/film';
import { Serie } from '../modeles/serie';
import { StockageOeuvreLocal } from '../services/stockageOeuvreLocal';

@Component({
  selector: 'app-ajouter-oeuvre',
  templateUrl: './ajouter-oeuvre.component.html',
  styleUrls: ['./ajouter-oeuvre.component.scss'],
  standalone: false,
})
export class AjouterOeuvreComponent implements OnInit {
  @Output() validerClick = new EventEmitter<void>();
  @Output() annulerClick = new EventEmitter<void>();

  oeuvreForm!: FormGroup;
  oeuvrePreview$!: Observable<any>;
  typeOeuvre: 'film' | 'serie' = 'film';
  imageError: boolean = false;

  statuts = [
    { valeur: 'en_cours', label: 'En cours' },
    { valeur: 'termine', label: 'Terminé' },
    { valeur: 'a_voir', label: 'À voir' }
  ];

  private fb = inject(FormBuilder);
  private stockageLocal = inject(StockageOeuvreLocal);

  constructor() {}

  ngOnInit() {
    this.oeuvreForm = this.fb.group({
      type: ['film', [Validators.required]],
      titre: ['', [Validators.required]],
      statut: ['a_voir', [Validators.required]],
      dateSortie: ['', [Validators.required]],
      cheminAffiche: ['', [Validators.required]],
      apercu: [''],
      note: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      dureeTotale: [0],
      nbSaisonsTotal: [0],
      nbEpisodesTotal: [0]
    });

    this.oeuvreForm.get('type')?.valueChanges.subscribe(type => {
      this.typeOeuvre = type;
      this.imageError = false;
    });

    this.oeuvreForm.get('cheminAffiche')?.valueChanges.subscribe(() => {
      this.imageError = false;
    });

    this.oeuvrePreview$ = this.oeuvreForm.valueChanges.pipe(
      startWith(this.oeuvreForm.value),
      map(formValue => ({ ...formValue }))
    );
  }

  valider() {
    if (this.oeuvreForm.invalid) return;

    const formValue = this.oeuvreForm.value;
    const statut = formValue.statut;
    const note = formValue.note / 10;

    if (formValue.type === 'film') {
      const filmData = {
        id: Date.now(),
        title: formValue.titre,
        release_date: formValue.dateSortie,
        poster_path: formValue.cheminAffiche,
        overview: formValue.apercu,
        vote_average: note,
        statut: statut,
        favori: false,
        heures: 0,
        minutes: 0,
        dureeTotale: formValue.dureeTotale
      };

      const film = new Film(filmData);
      this.stockageLocal.modifierFilmAvecTotal(
        film, statut, false, note, 0, 0, formValue.dureeTotale
      );
    } else {
      const serieData = {
        id: Date.now(),
        name: formValue.titre,
        first_air_date: formValue.dateSortie,
        poster_path: formValue.cheminAffiche,
        overview: formValue.apercu,
        vote_average: note,
        statut: statut,
        favori: false,
        saison: 0,
        episode: 0,
        nbSaisonsTotal: formValue.nbSaisonsTotal,
        nbEpisodesTotal: formValue.nbEpisodesTotal
      };

      const serie = new Serie(serieData);
      this.stockageLocal.modifierSerieAvecTotal(
        serie, statut, false, note, 0, 0, formValue.nbSaisonsTotal, formValue.nbEpisodesTotal
      );
    }

    this.validerClick.emit();
  }

  reinitialiser() {
    this.oeuvreForm.reset({
      type: 'film',
      statut: 'a_voir',
      note: 0,
      dureeTotale: 0,
      nbSaisonsTotal: 0,
      nbEpisodesTotal: 0
    });
    this.imageError = false;
  }

  annuler() {
    this.annulerClick.emit();
  }

  onImageError(event: Event) {
    if (!this.imageError) {
      this.imageError = true;
      (event.target as HTMLImageElement).style.display = 'none';
    }
  }
}
