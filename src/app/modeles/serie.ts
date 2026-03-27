export class Serie {
  private _id!: number;
  private _titre!: string;
  private _dateSortie!: string;
  private _cheminAffiche!: string;
  private _apercu!: string;
  private _note!: number;
  private _type: 'serie' = 'serie';
  private _lienBandeAnnonce!: string;
  private _favori!: boolean;

  // Propriétés spécifiques aux séries
  private _saison!: number;
  private _episode!: number;

  // Propriétés issues du stockage local
  private _statut: 'en_cours' | 'termine' | 'a_voir' = 'a_voir';

  constructor(obj: any) {
    this._id = obj.id;
    this._titre = obj.title || obj.name;
    this._dateSortie = obj.release_date || obj.first_air_date;
    this._cheminAffiche = obj.poster_path;
    this._apercu = obj.overview;
    this._note = obj.vote_average || 0;

    // Propriétés du stockage local
    this._statut = obj.statut || 'a_voir';
    this._lienBandeAnnonce = obj.lienBandeAnnonce;
    this._saison = obj.saison || 0;
    this._episode = obj.episode || 0;
  }

  get id(): number { return this._id; }

  get titre(): string { return this._titre; }
  set titre(valeur: string) { this._titre = valeur; }

  get dateSortie(): string {
    if (!this._dateSortie) return 'Date inconnue';
    return this._dateSortie.split('-')[0];
  }

  get dateSortieComplete(): string {
    return this._dateSortie || 'Date inconnue';
  }

  get cheminAffiche(): string {
    if (this._cheminAffiche && (this._cheminAffiche.startsWith('http://') || this._cheminAffiche.startsWith('https://'))) {
      return this._cheminAffiche;
    }
    return 'https://image.tmdb.org/t/p/w185/' + this._cheminAffiche;
  }

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

  get type(): 'serie' {
    return this._type;
  }

  get lienBandeAnnonce(): string { return this._lienBandeAnnonce; }
  set lienBandeAnnonce(valeur: string) { this._lienBandeAnnonce = valeur; }

  get statut() { return this._statut; }
  set statut(valeur) { this._statut = valeur; }

  get favori(): boolean { return this._favori; }
  set favori(valeur: boolean) { this._favori = valeur; }

  get estFavori(): boolean {
    const data = localStorage.getItem('mes_films_data');
    if (!data) return false;
    const collection = JSON.parse(data);
    // On cherche si cette série précise est enregistrée comme favorite
    const local = collection.find((item: any) => item.id === this._id && item.type === 'serie');
    return local ? local.favori : false;
  }

  get saison(): number { return this._saison; }
  set saison(valeur: number) { this._saison = valeur; }

  get episode(): number { return this._episode; }
  set episode(valeur: number) { this._episode = valeur; }
}
