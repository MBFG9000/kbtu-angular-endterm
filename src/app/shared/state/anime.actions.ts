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

// favorites
export const loadFavorites = createAction('[Anime] Load Favorites');

export const loadFavoritesSuccess = createAction(
  '[Favorites] Load Favorites Success',
  props<{ items: AnimeDetail[]; ids: number[] }>()
);

export const loadFavoritesFailure = createAction(
  '[Anime] Load Favorites Failure',
  props<{ error: any }>()
);

export const addFavorite = createAction(
  '[Anime] Add Favorite',
  props<{ id: number }>()
);

export const removeFavorite = createAction(
  '[Anime] Remove Favorite',
  props<{ id: number }>()
);

export const clearFavorites = createAction('[Anime] Clear Favorites');


// UI / local actions (optional)
export const clearAnimeList = createAction('[Anime] Clear Anime List');
export const clearSelectedAnime = createAction('[Anime] Clear Selected Anime');
