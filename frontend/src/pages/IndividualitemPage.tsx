import { Context } from "../context/storeContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";

function IndividualItemPage() {
  const { movieList } = useContext(Context);
  const location = useLocation();

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
      {movieList &&
        movieList.length > 0 &&
        movieList.map((item) => {
          if (item.title === movie_title) {
            return (
              <div key={item.id}>
                <img src={`../.${item.thumbnail.regular.small}`} />
                <p>{item.title}</p>
              </div>
            );
          }
          return;
        })}
    </>
  );
}

export default IndividualItemPage;
