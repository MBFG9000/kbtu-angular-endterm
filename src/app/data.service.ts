import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Sneaker } from './shared/models/sneakers.model';
import { JikanListResponse, AnimeItem, AnimeDetail, JikanAnimeDetailResponse, PaginationInfo } from './shared/models/anime.model'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiBaseUrl = 'https://api.jikan.moe';
  private readonly ApiUrl = `${this.apiBaseUrl}/v4`;

  constructor(private readonly http: HttpClient) {}

  getTopAnime(page = 1, limit = 12): Observable<JikanListResponse<AnimeItem>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));
    return this.http.get<JikanListResponse<AnimeItem>>(`${this.ApiUrl}/top/anime`, { params });
  }

  searchAnime(query: string, page = 1, limit = 25): Observable<JikanListResponse<AnimeItem>> {
    const params = new HttpParams()
      .set('q', query ?? '')
      .set('page', String(page))
      .set('limit', String(limit));
    return this.http
      .get<JikanListResponse<AnimeItem>>(`${this.ApiUrl}/anime`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get anime details by id: /v4/anime/{id}
   * Возвращаем сразу AnimeDetail (res.data), т.к. Jikan отдаёт { data: {...} }.
   */
  getAnimeById(id: number): Observable<AnimeDetail> {
    return this.http
      .get<JikanAnimeDetailResponse>(`${this.apiBaseUrl}/anime/${id}`)
      .pipe(
        map(res => res.data),
        catchError(this.handleError)
      );
  }

  /**
   * Утилита: безопасно выбрать лучший URL изображения из поля images (small -> image -> large)
   * Возвращает string | null
   */
  pickBestImage(item: AnimeItem | AnimeDetail): string | null {
    const imgs = item?.images;
    const jpg = imgs?.jpg;
    const webp = imgs?.webp;

    // предпочтение: small_image_url -> image_url -> large_image_url
    return (
      jpg?.small_image_url ??
      jpg?.image_url ??
      jpg?.large_image_url ??
      webp?.small_image_url ??
      webp?.image_url ??
      webp?.large_image_url ??
      null
    );
  }

  /**
   * Опционально: маппер, который возвращает объект с data + pagination (если нужно использовать в компонентах)
   * Не обязателен, т.к. сервис возвращает JikanListResponse напрямую.
   */
  mapListToItems(res: JikanListResponse<AnimeItem>): { items: AnimeItem[]; pagination: PaginationInfo } {
    return { items: res.data, pagination: res.pagination };
  }

  /**
   * Общая обработка ошибок HTTP
   */
  private handleError(err: HttpErrorResponse) {
    // здесь можно расширить: логирование, Sentry и т.п.
    let message = 'Unknown error';
    if (err.error instanceof ErrorEvent) {
      // client-side
      message = `Client error: ${err.error.message}`;
    } else {
      // server-side
      message = `Server error: ${err.status} ${err.statusText || ''}`.trim();
      if (err.error && typeof err.error === 'object' && err.error.message) {
        message += ` - ${err.error.message}`;
      }
    }
    console.error('DataService error:', err);
    return throwError(() => ({ status: err.status, message }));
  }
}

