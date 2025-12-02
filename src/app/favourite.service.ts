// src/app/shared/services/favourites.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly KEY = 'aniFind:favorites';

  // internal BehaviorSubject хранит массив id (синхронно читается при создании)
  private ids$ = new BehaviorSubject<number[]>(this.readFromStorage());

  // публичный observable (поток id[])
  public readonly favoritesIds$: Observable<number[]> = this.ids$.asObservable();

  // алиас для обратной совместимости (если где-то используется favorites$)
  public readonly favorites$ = this.favoritesIds$;

  constructor() {}

  /** ===== READ (sync) ===== */
  private readFromStorage(): number[] {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.map((x: any) => Number(x)).filter(n => Number.isFinite(n))
        : [];
    } catch (err) {
      console.warn('FavoritesService: failed to read from localStorage', err);
      return [];
    }
  }

  /** ===== WRITE (safe) ===== */
  private save(ids: number[]) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(ids));
    } catch (err) {
      // не ломаем приложение при ошибке записи
      console.warn('FavoritesService: failed to write to localStorage', err);
    }
  }

  /** ===== Public API ===== */

  /** Снимок текущих id (синхронно) */
  getSnapshot(): number[] {
    return this.ids$.value;
  }

  /** Проверить, есть ли id в избранном */
  has(id: number): boolean {
    return this.ids$.value.includes(id);
  }

  /** Добавить id в избранное (игнорирует дубликаты) */
  add(id: number) {
    const cur = this.ids$.value;
    if (!cur.includes(id)) {
      const updated = [...cur, id];
      this.ids$.next(updated);
      this.save(updated);
    }
  }

  /** Удалить id из избранного */
  remove(id: number) {
    const cur = this.ids$.value;
    if (cur.includes(id)) {
      const updated = cur.filter(x => x !== id);
      this.ids$.next(updated);
      this.save(updated);
    }
  }

  /** Переключить состояние (toggle) */
  toggle(id: number) {
    if (this.has(id)) this.remove(id);
    else this.add(id);
  }

  /** Заменить весь список (заменяет localStorage + BehaviorSubject) */
  set(ids: number[]) {
    const normalized = Array.isArray(ids)
      ? ids.map(x => Number(x)).filter(n => Number.isFinite(n))
      : [];
    this.ids$.next(normalized);
    this.save(normalized);
  }

  /** Добавить несколько id (без дубликатов) */
  addMany(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) return;
    const cur = this.ids$.value;
    const toAdd = ids.map(x => Number(x)).filter(n => Number.isFinite(n) && !cur.includes(n));
    if (toAdd.length === 0) return;
    const updated = [...cur, ...toAdd];
    this.ids$.next(updated);
    this.save(updated);
  }

  /** Очистить избранное */
  clear() {
    this.ids$.next([]);
    this.save([]);
  }

  /**
   * Слить локальные favorites с серверными при логине:
   * - mergeServerIds — массив id из сервера
   * - strategy:
   *     'merge' (default) — объединить и сохранить
   *     'overwrite' — заменить серверными (используй если сервер авто-правильный)
   * Возвращает итоговый массив.
   */
  mergeWithServerIds(serverIds: number[], strategy: 'merge' | 'overwrite' = 'merge'): number[] {
    const normalizedServer = Array.isArray(serverIds)
      ? Array.from(new Set(serverIds.map(x => Number(x)).filter(n => Number.isFinite(n))))
      : [];

    let result: number[];
    if (strategy === 'overwrite') {
      result = normalizedServer;
    } else {
      // merge unique
      const cur = this.ids$.value;
      result = Array.from(new Set([...cur, ...normalizedServer]));
    }

    this.ids$.next(result);
    this.save(result);
    return result;
  }
}
