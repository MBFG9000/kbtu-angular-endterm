// src/app/shared/state/anime.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AnimeActions from './anime.actions';
import { DataService } from '../../data.service';
import { FavoritesService } from '../../favourite.service';
import { catchError, map, switchMap, withLatestFrom, tap, take } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectPage, selectLimit } from './anime.selectors';
import { AnimeDetail } from '../models/anime.model';

@Injectable()
export class AnimeEffects {
  private readonly actions$ = inject(Actions);
  private readonly dataService = inject(DataService);
  private readonly store = inject(Store);
  private readonly favService = inject(FavoritesService);

  /** ===========================
   *  LOAD LIST + SEARCH
   * ============================ */
  loadAnimes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnimeActions.loadAnimes),
      withLatestFrom(
        this.store.select(selectPage),
        this.store.select(selectLimit)
      ),
      switchMap(([action, storePage, storeLimit]) => {
        const query = action.query?.trim() ?? '';
        const page = action.page ?? storePage ?? 1;
        const limit = action.limit ?? storeLimit ?? 25;

        const req$ = query
          ? this.dataService.searchAnime(query, page, limit)
          : this.dataService.getTopAnime(page, limit);

        return req$.pipe(
          map(res =>
            AnimeActions.loadAnimesSuccess({
              items: res.data,
              pagination: res.pagination
            })
          ),
          catchError(error =>
            of(AnimeActions.loadAnimesFailure({ error }))
          )
        );
      })
    )
  );

  /** ===========================
   *  LOAD DETAILS
   * ============================ */
  loadAnime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnimeActions.loadAnime),
      switchMap(({ id }) =>
        this.dataService.getAnimeById(id).pipe(
          map(detail => AnimeActions.loadAnimeSuccess({ detail })),
          catchError(error => of(AnimeActions.loadAnimeFailure({ error })))
        )
      )
    )
  );

  /** ===========================
   *  FAVORITES: LOAD
   * ============================ */
loadFavorites$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AnimeActions.loadFavorites),
    switchMap(() => {
      // берем snapshot синхронно — нет подписки на поток
      const ids = this.favService.getSnapshot() ?? [];

      if (!ids || ids.length === 0) {
        return of(AnimeActions.loadFavoritesSuccess({ items: [], ids: [] }));
      }

      // разделяем на кэшированные и отсутствующие
      const cachedItems: AnimeDetail[] = [];
      const missingIds: number[] = [];

      for (const id of ids) {
        const cached = this.dataService.getFromCache?.(id); // безопасный вызов
        if (cached) cachedItems.push(cached);
        else missingIds.push(id);
      }

      if (missingIds.length === 0) {
        return of(AnimeActions.loadFavoritesSuccess({ items: cachedItems, ids }));
      }

      // загрузим только недостающие
      const requests = missingIds.map(id =>
        this.dataService.getAnimeById(id).pipe(
          catchError(err => {
            console.warn('Failed loading favorite id', id, err);
            return of(null);
          })
        )
      );

      return forkJoin(requests).pipe(
        map(results => {
          const loaded = (results as Array<AnimeDetail | null>).filter((r): r is AnimeDetail => !!r);
          const items = [...cachedItems, ...loaded];
          return AnimeActions.loadFavoritesSuccess({ items, ids });
        }),
        catchError(error => of(AnimeActions.loadFavoritesFailure({ error })))
      );
    })
  )
);

  /** ===========================
   *  FAVORITES: ADD
   * ============================ */
  persistAddFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnimeActions.addFavorite),
      tap(({ id }) => this.favService.add(id)),
      
    ),
    { dispatch: false } 
  );

  /** ===========================
   *  FAVORITES: REMOVE
   * ============================ */
  persistRemoveFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnimeActions.removeFavorite),
      tap(({ id }) => this.favService.remove(id)),
    ),
    { dispatch: false } 
  );

  /** ===========================
   *  FAVORITES: AUTO-LOAD AT START
   * ============================ */
  initFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType('@ngrx/effects/init'),
      map(() => AnimeActions.loadFavorites())
    )
  );
}
