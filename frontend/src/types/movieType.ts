import thumbnailTypes from "./thumbnailTypes";

interface movieType {
  id: number;
  title: string;
  thumbnail: thumbnailTypes;
  year: number;
  category: string;
  rating: string;
  isBookmarked: boolean;
  isTrending: boolean;
}

export default movieType;
