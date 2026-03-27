import { Film } from './film';
import { Serie } from './serie';

// Filtres utilisés dans la page Naviguer
export interface FiltresRecherche {
  tri: 'titre_az' | 'popularite';
  statut: 'tous' | 'en_cours' | 'termine' | 'a_voir';
  type: 'tous' | 'films' | 'series';
  favoris: 'tous' | 'favoris';
}

// Résultat paginé renvoyé par l'API
export interface ResultatRecherche {
  resultats: (Film | Serie)[];
  total: number;
  page: number;
  totalPages: number;
}
