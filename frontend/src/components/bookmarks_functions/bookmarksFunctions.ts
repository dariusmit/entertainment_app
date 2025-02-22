import { axiosJWT, config } from "../../axios/axios";
import { isMovieType } from "../../helpers/isMovieType";
import movieType from "../../types/movieType";
import seriesType from "../../types/seriesType";

export const fetchBookmarkedItems = async (
  isLoading: boolean,
  accessToken: string | null,
  setBookmarkedItems: React.Dispatch<React.SetStateAction<number[]>>
): Promise<void> => {
  if (isLoading || !accessToken) {
    console.error("Access token not yet available!");
    return;
  }
  try {
    const res = await axiosJWT.post(
      `${
        import.meta.env.VITE_MODE === "dev"
          ? `http://localhost:8081`
          : `https://entertainment-app-wheat.vercel.app`
      }/get_bookmarked_items`,
      {},
      config(accessToken)
    );

    if (res.data) {
      const { movies, series } = res.data;
      setBookmarkedItems((prev) => [
        ...prev,
        ...movies.map((m: any) => m.id),
        ...series.map((s: any) => s.id),
      ]);
    }
  } catch (error) {
    console.error("Error fetching bookmarked items:", error);
  }
};

const isBookmarked = async (
  id: number,
  media_type: string,
  accessToken: string | null
): Promise<boolean> => {
  try {
    const res = await axiosJWT.post(
      `${
        import.meta.env.VITE_MODE === "dev"
          ? `http://localhost:8081`
          : `https://entertainment-app-wheat.vercel.app`
      }/is_bookmarked`,
      {
        id,
        media_type,
      },
      config(accessToken)
    );
    return typeof res.data.isBookmarked === "boolean"
      ? res.data.isBookmarked
      : false;
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false;
  }
};

export const handleBookmarkClick = async (
  movie: movieType | seriesType,
  accessToken: string | null,
  setBookmarkedItems: React.Dispatch<React.SetStateAction<number[]>>,
  movies?: (movieType | seriesType)[]
): Promise<void> => {
  const mediaType = isMovieType(movie) ? "movie" : "series";
  const isBookmarkedStatus = await isBookmarked(
    movie.id,
    mediaType,
    accessToken
  );

  if (isBookmarkedStatus) {
    await removeBookmark(movie.id, mediaType, accessToken, setBookmarkedItems);
    if (location.pathname === "/bookmarks") {
      location.reload();
    }
  } else {
    await bookmarkContent(
      movie.id,
      mediaType,
      movies,
      accessToken,
      setBookmarkedItems
    );
  }
};

const bookmarkContent = async (
  id: number,
  media_type: string,
  movies: (movieType | seriesType)[] | undefined,
  accessToken: string | null,
  setBookmarkedItems: React.Dispatch<React.SetStateAction<number[]>>
): Promise<void> => {
  try {
    await axiosJWT.post(
      `${
        import.meta.env.VITE_MODE === "dev"
          ? `http://localhost:8081`
          : `https://entertainment-app-wheat.vercel.app`
      }/bookmark_item`,
      {
        id,
        movies,
        media_type,
      },
      config(accessToken)
    );
    setBookmarkedItems((prev) => [...prev, id]);
  } catch (err) {
    console.log("Error bookmarking:", err);
  }
};

const removeBookmark = async (
  id: number,
  media_type: string,
  accessToken: string | null,
  setBookmarkedItems: React.Dispatch<React.SetStateAction<number[]>>
): Promise<void> => {
  try {
    await axiosJWT.post(
      `${
        import.meta.env.VITE_MODE === "dev"
          ? `http://localhost:8081`
          : `https://entertainment-app-wheat.vercel.app`
      }/remove_bookmarked_item`,
      {
        id,
        media_type,
      },
      config(accessToken)
    );
    setBookmarkedItems((prev) => prev.filter((item) => item !== id));
  } catch (err) {
    console.log("Error removing bookmark:", err);
  }
};
