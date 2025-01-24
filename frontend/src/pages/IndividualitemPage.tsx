import { Context } from "../context/storeContext";
import { useContext } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function IndividualItemPage() {
  const { movieList, isLoggedIn } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  function formatTitle(inputString: string): string {
    const regex = /\/movies\/|\/shows\//g;
    return inputString
      .replace(regex, "") // Replace words /movies/ and /shows/ with empty space
      .replace(/_/g, " ") // Replace _ with " "
      .split(" ") // Split the string into words by spaces
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join the words back into a single string
  }

  const movie_title = formatTitle(location.pathname);

  return (
    <>
      <Header />
      {movieList &&
        movieList.length > 0 &&
        movieList.map((item) => {
          if (item.title === movie_title) {
            return (
              <div className="px-[4.27vw] pb-[16.27vw]" key={item.id}>
                <img
                  className="w-full mb-[4.27vw] rounded-lg"
                  src={`../.${item.thumbnail.regular.small}`}
                />
                <div>
                  <div className="flex text-[3.47vw] font-extralight">
                    <p className="mr-[1.6vw]">{item.year}</p>
                    <p className="mr-[1.6vw]">·</p>
                    <div className="flex items-center mr-[1.6vw]">
                      <img
                        src={
                          item.category === "Movie"
                            ? "../../assets/icon-category-movie.svg"
                            : "../../assets/icon-category-tv.svg"
                        }
                        className="w-[2.67vw] h-[2.67vw] mr-1"
                      />
                      <p>{item.category}</p>
                    </div>
                    <p className="mr-[1.6vw]">·</p>
                    <p>{item.rating}</p>
                  </div>
                  <p className="text-[4vw]">{item.title}</p>
                </div>
              </div>
            );
          }
          return;
        })}
    </>
  );
}

export default IndividualItemPage;
