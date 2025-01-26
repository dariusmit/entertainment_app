import { useEffect, useContext } from "react";
import { Context } from "../context/storeContext";
import MovieCard from "../components/MovieCard";
import Search from "../components/Search";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import movieType from "../types/movieType";

function Movies() {
  const {
    isLoggedIn,

    searchCompleted,

    updateActionMovies,
    getContent,
    actionMovies,
    comedyMovies,
    horrorMovies,
    documentaryMovies,
    romanceMovies,
    PATHS,
    updateComedyMovies,
    updateHorrorMovies,
    updateRomanceMovies,
    updateDocumentaryMovies,
  } = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      async function updateContentState() {
        try {
          updateActionMovies(await getContent(PATHS.ActionMovies));
          updateComedyMovies(await getContent(PATHS.ComedyMovies));
          updateHorrorMovies(await getContent(PATHS.HorrorMovies));
          updateRomanceMovies(await getContent(PATHS.RomanceMovies));
          updateDocumentaryMovies(await getContent(PATHS.DocumentaryMovies));
        } catch (err: any) {
          console.log(err.message);
        }
      }
      updateContentState();
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  return (
    <>
      <Header />
      <Search />
      <div className="px-[4.27vw] pb-[16.27vw]">
        {!searchCompleted && (
          <h1 className="font-light text-[5.33vw] mt-4 mb-2">Action movies</h1>
        )}
        <div className="grid grid-cols-2 gap-3">
          {actionMovies &&
            actionMovies.length != 0 &&
            actionMovies.map((movie: movieType) => {
              return <MovieCard key={movie.id} movie={movie} />;
            })}
        </div>
      </div>
      <div className="px-[4.27vw] pb-[16.27vw]">
        {!searchCompleted && (
          <h1 className="font-light text-[5.33vw] mt-4 mb-2">Comedy movies</h1>
        )}
        <div className="grid grid-cols-2 gap-3">
          {comedyMovies &&
            comedyMovies.length != 0 &&
            comedyMovies.map((movie: movieType) => {
              return <MovieCard key={movie.id} movie={movie} />;
            })}
        </div>
      </div>
      <div className="px-[4.27vw] pb-[16.27vw]">
        {!searchCompleted && (
          <h1 className="font-light text-[5.33vw] mt-4 mb-2">Horror movies</h1>
        )}
        <div className="grid grid-cols-2 gap-3">
          {horrorMovies &&
            horrorMovies.length != 0 &&
            horrorMovies.map((movie: movieType) => {
              return <MovieCard key={movie.id} movie={movie} />;
            })}
        </div>
      </div>
      <div className="px-[4.27vw] pb-[16.27vw]">
        {!searchCompleted && (
          <h1 className="font-light text-[5.33vw] mt-4 mb-2">Romance movies</h1>
        )}
        <div className="grid grid-cols-2 gap-3">
          {romanceMovies &&
            romanceMovies.length != 0 &&
            romanceMovies.map((movie: movieType) => {
              return <MovieCard key={movie.id} movie={movie} />;
            })}
        </div>
      </div>
      <div className="px-[4.27vw] pb-[16.27vw]">
        {!searchCompleted && (
          <h1 className="font-light text-[5.33vw] mt-4 mb-2">
            Documentary movies
          </h1>
        )}
        <div className="grid grid-cols-2 gap-3">
          {documentaryMovies &&
            documentaryMovies.length != 0 &&
            documentaryMovies.map((movie: movieType) => {
              return <MovieCard key={movie.id} movie={movie} />;
            })}
        </div>
      </div>
    </>
  );
}

export default Movies;
