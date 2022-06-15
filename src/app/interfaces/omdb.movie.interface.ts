export interface Rating {
  Source: string;
  Value: string;
}

export interface OmdbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  releaseDate:string;
  Runtime: string;
  runtimeMins:number;
  Genre: string;
  genreList:string[];
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons: string;
  Response: string;
}