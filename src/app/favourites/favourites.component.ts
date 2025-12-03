import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AnimeActions from '../shared/state/anime.actions';
import { selectFavoritesDetails, selectFavoritesLoading } from '../shared/state/anime.selectors';
import { Observable } from 'rxjs';
import { AnimeDetail } from '../shared/models/anime.model';
import { SneakerCardSmComponent } from '../sneaker-card-sm/sneaker-card-sm.component';
import { AsyncPipe } from '@angular/common';



@Component({
  selector: 'app-favourites-page',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css'],
  imports: [SneakerCardSmComponent, AsyncPipe],
})
export class FavouritesComponent implements OnInit {
  favorites$!: Observable<AnimeDetail[]>;
  loading$!: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    // при входе на страницу — попросим эффект загрузить детали по id из localStorage
    this.store.dispatch(AnimeActions.loadFavorites());

    // подписываемся на готовые детали
    this.favorites$ = this.store.select(selectFavoritesDetails);
    this.loading$ = this.store.select(selectFavoritesLoading);
  }
}
