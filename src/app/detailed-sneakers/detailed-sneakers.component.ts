import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AnimeActions from '../shared/state/anime.actions';
import { selectDetailsError, selectDetailsLoading, selectSelectedAnime } from '../shared/state/anime.selectors';
import { AnimeDetail } from '../shared/models/anime.model';
import { DataService } from '../data.service';

@Component({
  standalone: true,
  selector: 'app-detailed-sneakers',
  imports: [CommonModule, RouterLink],
  templateUrl: './detailed-sneakers.component.html',
  styleUrls: ['./detailed-sneakers.component.css'] 
})
export class DetailedSneakersComponent implements OnInit, OnDestroy {
  anime?: AnimeDetail;
  loading = true;
  errorMessage = '';
  notFound = false;

  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private location: Location,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    // Подписки на store (справа — держим синхронизацию с селекторами)
    this.subscription.add(
      this.store.select(selectSelectedAnime).subscribe((anime) => {
        this.anime = anime ?? undefined;
      })
    );

    this.subscription.add(
      this.store.select(selectDetailsLoading).subscribe((isLoading) => {
        this.loading = isLoading;
      })
    );

    this.subscription.add(
      this.store.select(selectDetailsError).subscribe((error) => {
        this.errorMessage = error ?? '';
        this.notFound = this.errorMessage === 'Anime not found.';
      })
    );

    // Подписываемся на paramMap и при изменении id выполняем логику:
    // 1) если store.selected уже содержит нужный id — ничего не диспатчим
    // 2) если в dataService есть кэш — показываем его мгновенно
    // 3) иначе — диспатчим loadAnime({ id })
    this.subscription.add(
      this.route.paramMap
        .pipe(
          map((params) => params.get('id')),
          map((idParam) => idParam ?? ''),
          map((idParam) => idParam.trim()),
          map((idParam) => Number(idParam)),
          map((id) => (Number.isNaN(id) ? null : id))
        )
        .subscribe((id) => {
          // invalid id
          if (id === null) {
            this.anime = undefined;
            this.errorMessage = 'Anime not found.';
            this.notFound = true;
            this.loading = false;
            return;
          }

          // reset states
          this.errorMessage = '';
          this.notFound = false;

          // 1) сначала проверим, есть ли тот же selected в store
          this.store.select(selectSelectedAnime).pipe(take(1)).subscribe((selected) => {
            if (selected && selected.mal_id === id) {
              // already loaded in store — компонент подпишется на selectSelectedAnime и покажет данные
              return;
            }

            // 2) проверим кэш в DataService — если есть, покажем мгновенно (optimistic UI)
            const cached = this.dataService.getFromCache?.(id);
            if (cached) {
              this.anime = cached;
              this.loading = false;
              // Не диспатчим loadAnime, так как cached уже содержит детали.
              // Но если хочешь обновить данные с сервера, можешь диспатчить loadAnime здесь.
              return;
            }

            // 3) ничего нет — диспатчим загрузку через NgRx
            this.loading = true;
            this.store.dispatch(AnimeActions.loadAnime({ id }));
          });
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }

  imageUrl(): string {
    const picked = this.anime ? this.dataService.pickBestImage(this.anime) : null;
    return picked ?? 'https://static.crunchyroll.com/cr-acquisition/assets/img/start/hero/us-global/background-desktop.jpg';
  }

  studioList(): string {
    if (!this.anime?.studios?.length) {
      return '—';
    }
    return this.anime.studios.map((s) => s.name).join(', ');
  }
}
