const SWAPI_API = 'https://swapi.py4e.com/api';

type SWAPIMovie = {
  title: string;
  director: string;
  episode_id: number;
  opening_crawl: string;
};

type MovieProps = {
  title: string;
  director: string;
  episodeId: number;
  openingCrawl: string;
};

export class Movie implements MovieProps {
  readonly title: string;
  readonly director: string;
  readonly openingCrawl: string;
  readonly episodeId: number;

  constructor({ episodeId, title, director, openingCrawl }: MovieProps) {
    this.episodeId = episodeId;
    this.title = title;
    this.director = director;
    this.openingCrawl = openingCrawl;
  }

  compareTitle(title: string) {
    return this.title.toLowerCase() === title.toLowerCase().trim();
  }

  get episode(): string {
    return (
      ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][this.episodeId] ||
      this.episodeId.toString()
    );
  }
}

export type Movies = readonly Movie[];

export function filterMovies(movies: Movies, query?: string): Movies {
  if (!query || !movies.length) {
    return [];
  }

  const regex = new RegExp(`${query.trim()}`, 'i');
  return movies.filter((movie) => movie.title.search(regex) >= 0);
}

export const SWAPI = {
  async getAllMovies(): Promise<Movies> {
    const { results } = await fetch(SWAPI_API + '/films').then((res) => res.json());

    return results.map(
      ({ opening_crawl: openingCrawl, episode_id: episodeId, ...otherProps }: SWAPIMovie) =>
        new Movie({ ...otherProps, openingCrawl, episodeId }),
    );
  },
};
