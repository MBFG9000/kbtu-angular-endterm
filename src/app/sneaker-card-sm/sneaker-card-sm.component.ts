import { Component, Input } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimeDetail, AnimeItem } from '../shared/models/anime.model';
import { LucideAngularModule, Heart } from 'lucide-angular';
import { Store } from '@ngrx/store';
import { selectFavoritesIds } from '../shared/state/anime.selectors';
import * as AnimeActions from '../shared/state/anime.actions';
import { FavoritesService } from '../favourite.service';


@Component({
  standalone: true,
  selector: 'app-sneaker-card-sm',
  imports: [CurrencyPipe, RouterLink, LucideAngularModule, NgClass],
  templateUrl: './sneaker-card-sm.component.html',
  styleUrl: './sneaker-card-sm.component.css'
})

export class SneakerCardSmComponent {

  readonly Heart = Heart; 

  @Input() anime!: AnimeItem | AnimeDetail;

  fallback = 'https://static.crunchyroll.com/cr-acquisition/assets/img/start/hero/us-global/background-desktop.jpg';

  isFavourite = false;  
 
  constructor(private store: Store, private favService: FavoritesService) {}

  ngOnInit() {

    
    // 🟢 При инициализации карточки проверяем, есть ли ID в избранных
    // this.store.select(selectFavoritesIds).subscribe(ids => {
    //   console.log(ids);
    //   this.isFavourite = ids.includes(this.anime.mal_id);
    // });
this.favService.favoritesIds$.subscribe(ids => {
  this.isFavourite = ids.includes(this.anime.mal_id);
});
    
  }

  toggleFavourite(event: MouseEvent) {
    event.stopPropagation();
    console.log("hello");

    if (this.isFavourite) {
      this.store.dispatch(AnimeActions.removeFavorite({ id: this.anime.mal_id }));
    } else {
      this.store.dispatch(AnimeActions.addFavorite({ id: this.anime.mal_id }));
    }
  }
}
