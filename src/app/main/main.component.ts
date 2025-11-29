import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, Sparkles, Search, BookmarkCheck, Bell, Play, ArrowUpRight } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAnimeItems, selectListLoading, selectListError } from '../shared/state/anime.selectors';
import { loadAnimes } from '../shared/state/anime.actions';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-main',
  imports: [LucideAngularModule, RouterLink, AsyncPipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  readonly Sparkles = Sparkles;
  readonly Search = Search;
  readonly BookmarkCheck = BookmarkCheck;
  readonly Bell = Bell;
  readonly Play = Play;
  readonly ArrowUpRight = ArrowUpRight;

  topAnime$!: Observable<any[]>;
  topAnimeLoading$!: Observable<boolean>;
  topAnimeError$!: Observable<any>;

  heroMetrics = [
    { label: 'Anime indexed', value: '18K+' },
    { label: 'Watchlists synced', value: '92K' },
    { label: 'Seasonal charts', value: '4/yr' }
  ];

  constructor(private store: Store) {
    this.topAnime$ = this.store.select(selectAnimeItems).pipe(map(items => (items ?? []).slice(0, 12)));
    this.topAnimeLoading$ = this.store.select(selectListLoading);
    this.topAnimeError$ = this.store.select(selectListError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadAnimes({ page: 1, limit: 12 }));
  }

  featuredAnime = [
    {
      tag: 'Fall 2025',
      name: 'Crimson Arcadia',
      score: 9.1,
      accent: 'Rebellion in neon Kyoto, powered by folklore mechs.',
      genre: 'Action · Sci-fi',
      image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80'
    },
    {
      tag: 'New',
      name: 'Petals of Ether',
      score: 8.7,
      accent: 'Slice-of-life floating between sky islands and cafe shifts.',
      genre: 'Drama · Fantasy',
      image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80'
    },
    {
      tag: 'Fan favorite',
      name: 'Ironbound Lullaby',
      score: 9.4,
      accent: 'Found-family pilots guarding ancient lullabies.',
      genre: 'Mecha · Adventure',
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  perks = [
    {
      title: 'Smart filters',
      description: 'Search by genre, mood, studio, episode count, and score.',
      icon: Search
    },
    {
      title: 'Watchlist sync',
      description: 'Save shows, track progress, and pick up where you left off.',
      icon: BookmarkCheck
    },
    {
      title: 'Airing alerts',
      description: 'Get pinged when new episodes or seasons drop.',
      icon: Bell
    }
  ];

  lookbookSpots = [
    {
      title: 'Weekend binge club',
      description: 'Handpicked arcs for cozy marathons with friends.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Cozy slice-of-life',
      description: 'Low-key recs for winding down after long days.',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
    }
  ];
}
