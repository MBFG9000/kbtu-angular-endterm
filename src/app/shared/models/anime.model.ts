export interface PaginationInfo {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  }
  
export interface JikanListResponse<T> {
    pagination: PaginationInfo;
    data: T[];
}

// Ответ обёртка Jikan v4 для одного аниме
export interface JikanAnimeDetailResponse {
    data: AnimeDetail;
  }
  
  // Полный строго типизированный объект аниме (примерная структура по ответу)
  export interface AnimeDetail {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string | null;
        small_image_url: string | null;
        large_image_url: string | null;
      };
      webp: {
        image_url: string | null;
        small_image_url: string | null;
        large_image_url: string | null;
      };
      // возможны другие форматы, но в этом ответе только jpg и webp
    };
    trailer: {
      youtube_id: string | null;
      url: string | null;
      embed_url: string | null;
      images: {
        image_url: string | null;
        small_image_url: string | null;
        medium_image_url: string | null;
        large_image_url: string | null;
        maximum_image_url: string | null;
      };
    };
    approved: boolean;
    titles: Array<{
      type: string;
      title: string;
    }>;
    title: string;
    title_english: string | null;
    title_japanese: string | null;
    title_synonyms: string[]; // массив строк (может быть пустым)
    type: string | null;
    source: string | null;
    episodes: number | null;
    status: string | null;
    airing: boolean;
    aired: {
      from: string | null; // ISO datetime or null
      to: string | null;   // ISO datetime or null
      prop: {
        from: {
          day: number | null;
          month: number | null;
          year: number | null;
        };
        to: {
          day: number | null;
          month: number | null;
          year: number | null;
        };
      };
      string: string | null; // human readable
    };
    duration: string | null;
    rating: string | null;
    score: number | null;
    scored_by: number | null;
    rank: number | null;
    popularity: number | null;
    members: number | null;
    favorites: number | null;
    synopsis: string | null;
    background: string | null;
    season: string | null;
    year: number | null;
    broadcast: {
      day: string | null;
      time: string | null;
      timezone: string | null;
      string: string | null;
    };
    producers: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
    licensors: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
    studios: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
    genres: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
    explicit_genres: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
    themes: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
    demographics: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
    // В API могут быть дополнительные поля — оставляем индексатор, если понадобится
    [key: string]: unknown;
  }
  

export interface ImageFormat {
    image_url: string | null;
    small_image_url?: string | null;
    large_image_url?: string | null;
    medium_image_url?: string | null;
    maximum_image_url?: string | null;
  }
  
  export interface Images {
    jpg?: ImageFormat;
    webp?: ImageFormat;
    // возможно другие форматы в будущем
  }
  
  export interface Trailer {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
    images: {
      image_url?: string | null;
      small_image_url?: string | null;
      medium_image_url?: string | null;
      large_image_url?: string | null;
      maximum_image_url?: string | null;
    };
  }
  
  export interface TitleEntry {
    type: string;    // "Default" | "Synonym" | "Japanese" | "English" и т.д.
    title: string;
  }
  
  export interface AiredPropDate {
    day?: number | null;
    month?: number | null;
    year?: number | null;
  }
  
  export interface AiredProp {
    from?: AiredPropDate | null;
    to?: AiredPropDate | null;
  }
  
  export interface Aired {
    from?: string | null;   // ISO string
    to?: string | null;     // ISO string or null
    prop?: AiredProp;
    string?: string;        // human readable
  }
  
  export interface Broadcast {
    day?: string | null;    // e.g. "Fridays"
    time?: string | null;   // e.g. "23:00"
    timezone?: string | null; // e.g. "Asia/Tokyo"
    string?: string | null; // e.g. "Fridays at 23:00 (JST)"
  }
  
  export interface Producer {
    mal_id: number;
    type?: string;
    name: string;
    url?: string;
  }
  
  export interface Studio {
    mal_id?: number;
    type?: string;
    name: string;
    url?: string;
  }
  
  export interface Genre {
    mal_id: number;
    type?: string;
    name: string;
    url?: string;
  }
  
  export interface Demographic {
    mal_id: number;
    type?: string;
    name: string;
    url?: string;
  }
  
  export interface AnimeItem {
    mal_id: number;
    url: string;
    images?: Images;
    trailer?: Trailer;
    approved?: boolean;
  
    titles?: TitleEntry[];
    title?: string;
    title_english?: string | null;
    title_japanese?: string | null;
    title_synonyms?: string[];
  
    type?: string | null;       // "TV", "Movie", ...
    source?: string | null;     // "Manga", "Light novel", ...
    episodes?: number | null;
    status?: string | null;     // "Finished Airing", "Currently Airing", ...
    airing?: boolean;
  
    aired?: Aired | null;
    duration?: string | null;   // "24 min per ep", "1 hr 41 min"
    rating?: string | null;     // "PG-13 - Teens 13 or older"
    score?: number | null;
    scored_by?: number | null;
    rank?: number | null;
    popularity?: number | null;
    members?: number | null;
    favorites?: number | null;
  
    synopsis?: string | null;
    background?: string | null;
  
    season?: string | null;     // "fall", "winter", ...
    year?: number | null;
  
    broadcast?: Broadcast | null;
  
    producers?: Producer[] | null;
    licensors?: Producer[] | null; // same shape as Producer
    studios?: Studio[] | null;
    genres?: Genre[] | null;
    explicit_genres?: Genre[] | null;
    themes?: Genre[] | null;
    demographics?: Demographic[] | null;
  
    // любые дополнительные поля, которые может вернуть API (оставляем индексируемым)
    [key: string]: any;
  }
  