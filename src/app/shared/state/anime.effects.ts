// src/app/shared/state/anime.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AnimeActions from './anime.actions';
import { DataService } from '../../data.service';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectPage, selectLimit } from './anime.selectors';

@Injectable()
export class AnimeEffects {
  private readonly actions$ = inject(Actions);
  private readonly dataService = inject(DataService);
  private readonly store = inject(Store);

  /** ===========================
   *  LOAD LIST + SEARCH
   * ============================ */
  loadAnimes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnimeActions.loadAnimes),

      // get page/limit from store as fallback
      withLatestFrom(
        this.store.select(selectPage),
        this.store.select(selectLimit)
      ),

      switchMap(([action, storePage, storeLimit]) => {
        const query = action.query?.trim() ?? '';
        const page = action.page ?? storePage ?? 1;
        const limit = action.limit ?? storeLimit ?? 25;

        // choose request based on search or top anime
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
          map(detail =>
            AnimeActions.loadAnimeSuccess({ detail })
          ),
          catchError(error =>
            of(AnimeActions.loadAnimeFailure({ error }))
          )
        )
      )
    )
  );
}
