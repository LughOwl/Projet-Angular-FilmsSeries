export class UnFilm {
  private _id !: number;
  private _titre!: string;
  private _dateSortie!: string;
  private _cheminAffiche!: string;
  private _apercu!: string;
  private _note!: number;
  private _type!: 'film' | 'serie';

  constructor(obj: any) {
    this._id = obj.id || 0;
    this._titre = obj.title || obj.name || '';
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

  public set titre(valeur: string) {
    this._titre = valeur;
  }

  public get dateSortie(): string {
    if (!this._dateSortie) return 'Date inconnue';
    return this._dateSortie.split('-')[0];
  }

  public get dateSortieComplete(): string {
    return this._dateSortie || 'Date inconnue';
  }

  public get cheminAffiche(): string {
    return "https://image.tmdb.org/t/p/w185/" + this._cheminAffiche;
  }

  public get urlImage(): string {
    return this._cheminAffiche;
  }
  public set cheminAffiche(valeur: string) {
    this._cheminAffiche = valeur;
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
