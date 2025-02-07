interface movieType {
  id: number;
  title: string;
  poster_path: string;
  media_type: string;
  release_date: number;
  overview: string;
  genre_ids: [];
  genres: [];
  backdrop_path: string;
  vote_average: number;
  isBookmarked?: boolean;
}

export default movieType;
