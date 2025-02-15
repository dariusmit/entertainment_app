import { Link } from "react-router-dom";
import styleObjectType from "../types/styleObjectType";

interface Props {
  styleObject: styleObjectType | undefined;
}

function Navigation({ styleObject }: Props) {
  return (
    <nav className="flex desktop:flex-col desktop:items-center desktop:z-50">
      <Link
        className={
          "pr-[6.4vw] tablet:pr-[4.17vw] desktop:pr-0 desktop:mb-[2.78vw] svg-hover-filter " +
          styleObject?.homeMenuStyle
        }
        to={"/"}
      >
        <img
          className="desktop:w-[1.30vw] desktop:h-auto"
          src="../../assets/icon-nav-home.svg"
        ></img>
      </Link>
      <Link
        className={
          "pr-[6.4vw] tablet:pr-[4.17vw] desktop:pr-0 desktop:mb-[2.78vw] svg-hover-filter " +
          styleObject?.moviesMenuStyle
        }
        to={"/movies"}
      >
        <img
          className="desktop:w-[1.30vw] desktop:h-auto"
          src="../../assets/icon-nav-movies.svg"
        ></img>
      </Link>
      <Link
        className={
          "pr-[6.4vw] tablet:pr-[4.17vw] desktop:pr-0 desktop:mb-[2.78vw] svg-hover-filter " +
          styleObject?.showsMenuStyle
        }
        to={"/shows"}
      >
        <img
          className="desktop:w-[1.30vw] desktop:h-auto"
          src="../../assets/icon-nav-tv-series.svg"
        ></img>
      </Link>
      <Link
        className={
          "desktop:ease-in-out duration-150 svg-hover-filter " +
          styleObject?.bookmarksMenuStyle
        }
        to={"/bookmarks"}
      >
        <img
          className="desktop:w-[1.30vw] desktop:h-auto"
          src="../../assets/icon-nav-bookmark.svg"
        />
      </Link>
    </nav>
  );
}

export default Navigation;
