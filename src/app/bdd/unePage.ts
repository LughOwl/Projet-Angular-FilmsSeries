import { UnFilm } from './unFilm';

export interface UnePage {
  page: number;
  total_pages: number;
  total_results: number;
  results: UnFilm[];
}
