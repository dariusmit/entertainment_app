interface seriesType {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: number;
  genre_ids: [];
  overview: string;
  genres: [];
  backdrop_path: string;
  vote_average: number;
  isBookmarked?: boolean;
}

export default seriesType;
