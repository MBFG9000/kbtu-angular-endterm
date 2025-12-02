import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectAnimeItems, selectListError, selectListLoading } from '../shared/state/anime.selectors';
import * as AnimeActions from '../shared/state/anime.actions';
import { AnimeItem } from '../shared/models/anime.model';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { SneakerCardSmComponent } from '../sneaker-card-sm/sneaker-card-sm.component';


@Component({
  standalone: true,
  selector: 'app-sneakers',
  imports: [CommonModule, SneakerCardSmComponent],
  templateUrl: './sneakers.component.html',
  styleUrl: './sneakers.component.css'
})
export class SneakersComponent implements OnInit, OnDestroy {
  anime: AnimeItem[] = [];

  loading = false;
  errorMessage = '';
  searchQuery = '';
  private subscriptions = new Subscription();


  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select(selectAnimeItems).subscribe((items) => (this.anime = items ?? []))
    );

    this.subscriptions.add(
      this.store.select(selectListLoading).subscribe((isLoading) => (this.loading = isLoading))
    );

    this.subscriptions.add(
      this.store.select(selectListError).subscribe((error) => (this.errorMessage = error ?? ''))
    );

    this.subscriptions.add(
      this.route.queryParamMap
        .pipe(
          map((params) => params.get('q') ?? ''),
          map((query) => query.trim()),
          distinctUntilChanged(),
          tap((query) => (this.searchQuery = query)),
          debounceTime(250),
          tap((query) => this.store.dispatch(AnimeActions.loadAnimes({ query, page: 1, limit: 24 })))
        )
        .subscribe()
    );

    // initial load
    this.store.dispatch(AnimeActions.loadAnimes({ page: 1, limit: 24 }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  handleSearch(query: string): void {
    this.searchQuery = query;
    const trimmed = query.trim();
    const current = this.route.snapshot.queryParamMap.get('q') ?? '';

    if (trimmed === current) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: trimmed || null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  imageFor(item: AnimeItem): string | null {
    return this.dataService.pickBestImage(item);
  }
}
