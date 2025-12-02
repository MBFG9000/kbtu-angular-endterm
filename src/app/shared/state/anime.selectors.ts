import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ANIME_FEATURE_KEY, AnimeState } from './anime.reducer';

export const selectAnimeState = createFeatureSelector<AnimeState>(ANIME_FEATURE_KEY);

// list selectors
export const selectAnimeItems = createSelector(selectAnimeState, s => s.items);
export const selectPagination = createSelector(selectAnimeState, s => s.pagination);
export const selectListLoading = createSelector(selectAnimeState, s => s.listLoading);
export const selectListError = createSelector(selectAnimeState, s => s.listError);

// detail selectors
export const selectSelectedAnime = createSelector(selectAnimeState, s => s.selected);
export const selectDetailsLoading = createSelector(selectAnimeState, s => s.detailsLoading);
export const selectDetailsError = createSelector(selectAnimeState, s => s.detailsError);

// query / paging selectors
export const selectQuery = createSelector(selectAnimeState, s => s.query);
export const selectPage = createSelector(selectAnimeState, s => s.page);
export const selectLimit = createSelector(selectAnimeState, s => s.limit);

// derived selectors
export const selectHasNextPage = createSelector(selectPagination, p => !!p?.has_next_page);
export const selectLastVisiblePage = createSelector(selectPagination, p => p?.last_visible_page ?? 1);
export const selectTotalItems = createSelector(selectPagination, p => p?.items.total ?? 0);

export const selectFavoritesIds = createSelector(selectAnimeState, s => s.favoritesIds);
export const selectFavoritesDetails = createSelector(selectAnimeState, s => s.favoritesDetails);
export const selectFavoritesLoading = createSelector(selectAnimeState, s => s.favoritesLoading);
export const selectFavoritesError = createSelector(selectAnimeState, s => s.favoritesError);
