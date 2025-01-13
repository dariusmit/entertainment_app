import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav className="flex">
      <Link className="pr-[6.4vw]" to={"/"}>
        <img src="../../assets/icon-nav-home.svg"></img>
      </Link>
      <Link className="pr-[6.4vw]" to={"/movies"}>
        {" "}
        <img src="../../assets/icon-nav-movies.svg"></img>
      </Link>
      <Link className="pr-[6.4vw]" to={"/shows"}>
        {" "}
        <img src="../../assets/icon-nav-tv-series.svg"></img>
      </Link>
      <Link to={"/bookmarks"}>
        {" "}
        <img src="../../assets/icon-nav-bookmark.svg"></img>
      </Link>
    </nav>
  );
}

export default Navigation;
