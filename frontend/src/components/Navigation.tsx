import { Link } from "react-router-dom";
import styleObjectType from "../types/styleObjectType";

interface Props {
  styleObject: styleObjectType | undefined;
}

function Navigation({ styleObject }: Props) {
  return (
    <nav className="flex">
      <Link className={"pr-[6.4vw] " + styleObject?.homeMenuStyle} to={"/"}>
        <img src="../../assets/icon-nav-home.svg"></img>
      </Link>
      <Link
        className={"pr-[6.4vw] " + styleObject?.moviesMenuStyle}
        to={"/movies"}
      >
        <img src="../../assets/icon-nav-movies.svg"></img>
      </Link>
      <Link
        className={"pr-[6.4vw] " + styleObject?.showsMenuStyle}
        to={"/shows"}
      >
        <img src="../../assets/icon-nav-tv-series.svg"></img>
      </Link>
      <Link className={styleObject?.bookmarksMenuStyle} to={"/bookmarks"}>
        <img src="../../assets/icon-nav-bookmark.svg"></img>
      </Link>
    </nav>
  );
}

export default Navigation;
