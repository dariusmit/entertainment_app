import movieType from "../types/movieType";
import seriesType from "../types/seriesType";

//A type guard in TypeScript, which is used to narrow down a union type to a specific type and prevent error about missing properties being thrown
//"is" - is type predicate, is a special syntax in TypeScript that informs the compiler about the type of a variable when a condition is true.
export function isMovieType(movie: movieType | seriesType): movie is movieType {
  return "release_date" in movie;
}
