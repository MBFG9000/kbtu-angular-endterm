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
  limit: 25
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
  }))
);
