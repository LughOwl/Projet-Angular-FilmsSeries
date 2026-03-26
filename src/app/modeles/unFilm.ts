export class UnFilm {
  private _id!: number;
  private _titre!: string;
  private _dateSortie!: string;
  private _cheminAffiche!: string;
  private _apercu!: string;
  private _note!: number;
  private _type!: 'film' | 'serie';

  // Propriétés issues du stockage local (pas toujours présentes)
  public statut: 'en_cours' | 'termine' | 'a_voir' | null = null;
  public estFavori: boolean = false;

  constructor(obj: any) {
    this._id = obj.id || 0;
    this._titre = obj.title || obj.name || '';
    this._dateSortie = obj.release_date || obj.first_air_date || '';
    this._cheminAffiche = obj.poster_path || '';
    this._apercu = obj.overview || '';
    this._note = obj.vote_average || 0;
    this._type = obj.title ? 'film' : 'serie';

    // Champs optionnels venant du stockage local
    this.statut = obj.statut || null;
    this.estFavori = obj.favori || false;
  }

  get id(): number {
    return this._id;
  }

  get titre(): string {
    return this._titre;
  }

  set titre(valeur: string) {
    this._titre = valeur;
  }

  get dateSortie(): string {
    if (!this._dateSortie) return 'Date inconnue';
    return this._dateSortie.split('-')[0];
  }

  get dateSortieComplete(): string {
    return this._dateSortie || 'Date inconnue';
  }

  get cheminAffiche(): string {
    return 'https://image.tmdb.org/t/p/w185/' + this._cheminAffiche;
  }

  // URL brute sans le préfixe TMDB (pour le stockage local)
  get urlImage(): string {
    return this._cheminAffiche;
  }

  set cheminAffiche(valeur: string) {
    this._cheminAffiche = valeur;
  }

  get apercu(): string {
    return this._apercu || 'Aucune description disponible.';
  }

  get note(): number {
    return Math.round(this._note * 10) / 10;
  }

  get type(): 'film' | 'serie' {
    return this._type;
  }

  set type(valeur: 'film' | 'serie') {
    this._type = valeur;
  }
}
