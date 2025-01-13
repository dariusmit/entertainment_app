import Navigation from "./Navigation";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <div className="flex items-center justify-between w-full p-[4.8vw] h-[14.93vw] bg-[#161D2F] text-white mb-[6.4vw]">
        <img className="w-[6.67vw] h-[5.33vw]" src="../../assets/logo.svg" />
        <Navigation />
        <Link to={"/login"}>
          <img
            className="w-[6.4vw] h-[6.4vw] border border-white rounded-full"
            src="../../assets/image-avatar.png"
          />
        </Link>
      </div>
    </>
  );
}

export default Header;
