// src/app/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Sneaker } from './shared/models/sneakers.model';
import {
  JikanListResponse,
  AnimeItem,
  AnimeDetail,
  JikanAnimeDetailResponse,
  PaginationInfo
} from './shared/models/anime.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiBaseUrl = 'https://api.jikan.moe';
  private readonly ApiUrl = `${this.apiBaseUrl}/v4`;

  // ===== in-memory cache =====
  private animeCache = new Map<number, AnimeDetail>();

  constructor(private readonly http: HttpClient) {}

  getTopAnime(page = 1, limit = 12): Observable<JikanListResponse<AnimeItem>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));
    return this.http.get<JikanListResponse<AnimeItem>>(`${this.ApiUrl}/top/anime`, { params })
      .pipe(catchError(this.handleError));
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
   * Uses in-memory cache to avoid duplicate HTTP calls.
   * Returns Observable<AnimeDetail>.
   */
  getAnimeById(id: number): Observable<AnimeDetail> {
    // return from cache synchronously if available
    const cached = this.animeCache.get(id);
    if (cached) {
      return of(cached); //сделать поток, который просто вернёт это value
    }

    // otherwise fetch from API and cache result
    return this.http
      .get<JikanAnimeDetailResponse>(`${this.ApiUrl}/anime/${id}`)
      .pipe(
        map(res => res.data),
        tap(detail => {
          try {
            if (detail && typeof detail.mal_id === 'number') {
              this.animeCache.set(detail.mal_id, detail);
            }
          } catch (e) {
            // fail silently on caching problems
            console.warn('DataService: caching failed for id', id, e);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Возвращает синхронно объект из кэша или undefined
   */
  getFromCache(id: number): AnimeDetail | undefined {
    return this.animeCache.get(id);
  }

  /**
   * Проверяет наличие в кэше
   */
  hasInCache(id: number): boolean {
    return this.animeCache.has(id);
  }

  /**
   * Установить объект в кэш вручную (опционально можно использовать для prefetch)
   */
  setCache(id: number, detail: AnimeDetail) {
    if (detail && typeof id === 'number') {
      this.animeCache.set(id, detail);
    }
  }

  /**
   * Очистить кэш (для отладки или при необходимости)
   */
  clearCache() {
    this.animeCache.clear();
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
      jpg?.large_image_url ??
      jpg?.image_url ??
      jpg?.small_image_url ??
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
      if (err.error && typeof err.error === 'object' && (err.error as any).message) {
        message += ` - ${(err.error as any).message}`;
      }
    }
    console.error('DataService error:', err);
    return throwError(() => ({ status: err.status, message }));
  }
}
