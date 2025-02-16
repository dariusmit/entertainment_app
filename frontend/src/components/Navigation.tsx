import { Link } from "react-router-dom";
import styleObjectType from "../types/styleObjectType";
import { motion } from "framer-motion";

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
        <motion.img
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="desktop:w-[1.30vw] desktop:h-auto"
          src="../../assets/icon-nav-home.svg"
        />
      </Link>
      <Link
        className={
          "pr-[6.4vw] tablet:pr-[4.17vw] desktop:pr-0 desktop:mb-[2.78vw] svg-hover-filter " +
          styleObject?.moviesMenuStyle
        }
        to={"/movies"}
      >
        <motion.img
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="desktop:w-[1.30vw] desktop:h-auto"
          src="../../assets/icon-nav-movies.svg"
        />
      </Link>
      <Link
        className={
          "pr-[6.4vw] tablet:pr-[4.17vw] desktop:pr-0 desktop:mb-[2.78vw] svg-hover-filter " +
          styleObject?.showsMenuStyle
        }
        to={"/shows"}
      >
        <motion.img
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="desktop:w-[1.30vw] desktop:h-auto"
          src="../../assets/icon-nav-tv-series.svg"
        />
      </Link>
      <Link
        className={
          "desktop:ease-in-out duration-150 svg-hover-filter " +
          styleObject?.bookmarksMenuStyle
        }
        to={"/bookmarks"}
      >
        <motion.img
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="desktop:w-[1.30vw] desktop:h-auto"
          src="../../assets/icon-nav-bookmark.svg"
        />
      </Link>
    </nav>
  );
}

export default Navigation;
