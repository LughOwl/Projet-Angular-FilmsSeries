export class Film {
  private _id !: number;
  private _titre!: string;
  private _dateSortie!: string;
  private _cheminAffiche!: string;
  private _apercu!: string;
  private _note!: number;
  private _type!: 'film' | 'serie';
  private _lienBandeAnnonce!: string;
  private _favori!: boolean;
  private _heures!: number;
  private _minutes!: number;

  // Propriétés issues du stockage local (pas toujours présentes)
  private _statut: 'en_cours' | 'termine' | 'a_voir' ;

  constructor(obj: any) {
    this._id = obj.id ;
    this._titre = obj.title || obj.name ;
    this._dateSortie = obj.release_date || obj.first_air_date ;
    this._cheminAffiche = obj.poster_path ;
    this._apercu = obj.overview ;
    this._note = obj.vote_average || 0;
    this._type = obj.title ? 'film' : 'serie';

    // Champs optionnels venant du stockage local
    this._statut = obj.statut || null;
    this._lienBandeAnnonce = obj.lienBandeAnnonce ;
    this._statut = obj.statut || 'non_vu';
    this._favori = obj.favori || false;
    this._heures = obj.heures || 0;
    this._minutes = obj.minutes || 0;
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

  public get lienBandeAnnonce(): string { return this._lienBandeAnnonce; }
  public set lienBandeAnnonce(valeur: string) { this._lienBandeAnnonce = valeur; }

  public get statut() { return this._statut; }
  public set statut(valeur) { this._statut = valeur; }

  public get favori(): boolean { return this._favori; }
  public set favori(valeur: boolean) { this._favori = valeur; }

  get estFavori(): boolean {
    const data = localStorage.getItem('mes_films_data');
    if (!data) return false;
    const collection = JSON.parse(data);
    const local = collection.find((item: any) => item.id === this._id && item.type === 'film');
    return local ? local.favori : false;
  }

  public get heures(): number { return this._heures; }
  public set heures(valeur: number) { this._heures = valeur; }

  public get minutes(): number { return this._minutes; }
  public set minutes(valeur: number) { this._minutes = valeur; }
}
