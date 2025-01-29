interface movieType {
  id: number;
  title: string;
  poster_path: string;
  media_type: string;
  release_date: number;
  genre_ids: [];
  vote_average: number;
  isBookmarked?: boolean;
}

export default movieType;
