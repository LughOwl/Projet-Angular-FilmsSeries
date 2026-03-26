export class UnFilm {
  private _id!: number;
  private _titre!: string;
  private _titreOriginal!: string;
  private _dateSortie!: string;
  private _cheminAffiche!: string;
  private _apercu!: string;
  private _note!: number;
  private _type!: 'film' | 'serie';

  constructor(obj: any) {
    this._id = obj.id || 0;
    this._titre = obj.title || obj.name || '';
    this._titreOriginal = obj.original_title || obj.original_name || '';
    this._dateSortie = obj.release_date || obj.first_air_date || '';
    this._cheminAffiche = obj.poster_path || '';
    this._apercu = obj.overview || '';
    this._note = obj.vote_average || 0;
    this._type = obj.title ? 'film' : 'serie';
  }

  public get id(): number {
    return this._id;
  }

  public get titre(): string {
    return this._titre;
  }

  public get titreOriginal(): string {
    return this._titreOriginal;
  }

  public get dateSortie(): string {
    if (!this._dateSortie) return 'Date inconnue';
    return this._dateSortie.split('-')[0];
  }

  public get dateSortieComplete(): string {
    return this._dateSortie || 'Date inconnue';
  }

  public get cheminAffiche(): string {
    if (this._cheminAffiche && this._cheminAffiche !== '') {
      return "https://image.tmdb.org/t/p/w500/" + this._cheminAffiche;
    }
    return "https://via.placeholder.com/500x750?text=Pas+d'affiche";
  }

  public get apercu(): string {
    return this._apercu || 'Aucune description disponible.';
  }

  public get note(): number {
    return Math.round(this._note * 10) / 10;
  }

  public get type(): 'film' | 'serie' {
    return this._type;
  }

  public set type(valeur: 'film' | 'serie') {
    this._type = valeur;
  }
}
