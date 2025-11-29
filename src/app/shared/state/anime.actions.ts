import { createAction, props } from '@ngrx/store';
import { AnimeItem, AnimeDetail, PaginationInfo } from '../models/anime.model';

// LIST
export const loadAnimes = createAction(
  '[Anime] Load Animes',
  props<{ query?: string; page?: number; limit?: number }>()
);

export const loadAnimesSuccess = createAction(
  '[Anime] Load Animes Success',
  props<{ items: AnimeItem[]; pagination: PaginationInfo | null }>()
);

export const loadAnimesFailure = createAction(
  '[Anime] Load Animes Failure',
  props<{ error: any }>()
);

// DETAILS
export const loadAnime = createAction(
  '[Anime] Load Anime',
  props<{ id: number }>()
);

export const loadAnimeSuccess = createAction(
  '[Anime] Load Anime Success',
  props<{ detail: AnimeDetail }>()
);

export const loadAnimeFailure = createAction(
  '[Anime] Load Anime Failure',
  props<{ error: any }>()
);

// UI / local actions (optional)
export const clearAnimeList = createAction('[Anime] Clear Anime List');
export const clearSelectedAnime = createAction('[Anime] Clear Selected Anime');
