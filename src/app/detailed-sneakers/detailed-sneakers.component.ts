import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, map } from 'rxjs';
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
  styleUrl: './detailed-sneakers.component.css'
})
export class DetailedSneakersComponent implements OnInit, OnDestroy {
  anime?: AnimeDetail;
  loading = true;
  errorMessage = '';
  notFound = false;

  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private location: Location,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.subscription = new Subscription();

    this.subscription.add(
      this.store.select(selectSelectedAnime).subscribe((anime) => (this.anime = anime ?? undefined))
    );

    this.subscription.add(
      this.store.select(selectDetailsLoading).subscribe((isLoading) => (this.loading = isLoading))
    );

    this.subscription.add(
      this.store.select(selectDetailsError).subscribe((error) => {
        this.errorMessage = error ?? '';
        this.notFound = this.errorMessage === 'Anime not found.';
      })
    );

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
          if (id === null) {
            this.anime = undefined;
            this.errorMessage = 'Anime not found.';
            this.notFound = true;
            this.loading = false;
            return;
          }

          this.errorMessage = '';
          this.notFound = false;
          this.store.dispatch(AnimeActions.loadAnime({ id }));
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
