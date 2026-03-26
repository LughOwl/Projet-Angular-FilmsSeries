// Filtres utilisés dans la page Naviguer
export interface FiltresRecherche {
  tri: 'titre_az' | 'popularite';
  statut: 'tous' | 'en_cours' | 'termine' | 'a_voir';
  type: 'tous' | 'films' | 'series';
  favoris: 'tous' | 'favoris';
}

// Résultat paginé renvoyé par l'API
export interface ResultatRecherche {
  resultats: import('./unFilm').UnFilm[];
  total: number;
  page: number;
  totalPages: number;
}
