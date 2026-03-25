export class UnFilm {
  private _titre!: string;
  private _dateSortie!: string;
  private _cheminAffiche!: string;
  private _apercu!: string;
  private _note!: number;

  constructor(obj: any) {
    this._titre = obj.title;
    this._dateSortie = obj.release_date;
    this._cheminAffiche = obj.poster_path;
    this._apercu = obj.overview;
    this._note = obj.vote_average;
  }

  public get titre(): string {
    return this._titre;
  }

  public set titre(valeur: string) {
    this._titre = valeur;
  }

  public get dateSortie(): string {
    return this._dateSortie;
  }

  public set dateSortie(valeur: string) {
    this._dateSortie = valeur;
  }

  public get cheminAffiche(): string {
    return "https://image.tmdb.org/t/p/w185/" + this._cheminAffiche;
  }

  public set cheminAffiche(valeur: string) {
    this._cheminAffiche = valeur;
  }

  public get apercu(): string {
    return this._apercu;
  }

  public set apercu(valeur: string) {
    this._apercu = valeur;
  }

  public get note(): number {
    return this._note;
  }

  public set note(valeur: number) {
    this._note = valeur;
  }
}
