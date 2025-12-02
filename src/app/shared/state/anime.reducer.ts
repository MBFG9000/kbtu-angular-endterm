import { createReducer, on } from '@ngrx/store';
import * as AnimeActions from './anime.actions';
import { AnimeItem, AnimeDetail, PaginationInfo } from '../models/anime.model';

export const ANIME_FEATURE_KEY = 'anime';

export interface AnimeState {
  items: AnimeItem[];
  pagination: PaginationInfo | null;
  listLoading: boolean;
  listError: any | null;

  selected: AnimeDetail | null;
  detailsLoading: boolean;
  detailsError: any | null;

  query: string;
  page: number;
  limit: number;

  favoritesIds: number[];           // список id
  favoritesDetails: AnimeDetail[];  // полные объекты
  favoritesLoading: boolean;
  favoritesError: any | null;
}

export const initialAnimeState: AnimeState = {
  items: [],
  pagination: null,
  listLoading: false,
  listError: null,

  selected: null,
  detailsLoading: false,
  detailsError: null,

  query: '',
  page: 1,
  limit: 25,

  favoritesIds: [],
  favoritesDetails: [],
  favoritesLoading: false,
  favoritesError: null
};

export const animeReducer = createReducer(
  initialAnimeState,

  // Load list
  on(AnimeActions.loadAnimes, (state, { query, page, limit }) => ({
    ...state,
    listLoading: true,
    listError: null,
    query: query ?? state.query,
    page: page ?? state.page,
    limit: limit ?? state.limit
  })),

  on(AnimeActions.loadAnimesSuccess, (state, { items, pagination }) => ({
    ...state,
    items,
    pagination,
    listLoading: false,
    listError: null
  })),

  on(AnimeActions.loadAnimesFailure, (state, { error }) => ({
    ...state,
    listLoading: false,
    listError: error
  })),

  // Clear list
  on(AnimeActions.clearAnimeList, (state) => ({
    ...state,
    items: [],
    pagination: null,
    listError: null,
    listLoading: false
  })),

  // Details
  on(AnimeActions.loadAnime, (state) => ({
    ...state,
    selected: null,
    detailsLoading: true,
    detailsError: null
  })),

  on(AnimeActions.loadAnimeSuccess, (state, { detail }) => ({
    ...state,
    selected: detail,
    detailsLoading: false,
    detailsError: null
  })),

  on(AnimeActions.loadAnimeFailure, (state, { error }) => ({
    ...state,
    selected: null,
    detailsLoading: false,
    detailsError: error
  })),

  on(AnimeActions.clearSelectedAnime, (state) => ({
    ...state,
    selected: null,
    detailsLoading: false,
    detailsError: null
  })),

  on(AnimeActions.loadFavorites, (state) => ({
    ...state,
    favoritesLoading: true,
    favoritesError: null
  })),

  on(AnimeActions.loadFavoritesSuccess, (state, { items }) => ({
    ...state,
    favoritesDetails: items,
    favoritesIds: items.map(i => i.mal_id),
    favoritesLoading: false,
    favoritesError: null
  })),

  on(AnimeActions.loadFavoritesFailure, (state, { error }) => ({
    ...state,
    favoritesLoading: false,
    favoritesError: error
  })),

  // optimistic local updates of ids (optional, effects will write to storage)
  on(AnimeActions.addFavorite, (state, { id }) => ({
    ...state,
    favoritesIds: state.favoritesIds.includes(id) ? state.favoritesIds : [...state.favoritesIds, id]
  })),

  on(AnimeActions.removeFavorite, (state, { id }) => ({
    ...state,
    favoritesIds: state.favoritesIds.filter(x => x !== id)
  })),

  on(AnimeActions.clearFavorites, (state) => ({
    ...state,
    favoritesIds: [],
    favoritesDetails: []
  })),

);
