import { useContext } from "react";
import Navigation from "./Navigation";
import { Context } from "../context/storeContext";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styleObjectType from "../types/styleObjectType";

function Header() {
  const { userModal, setUserModal, setLoggedInStatus } = useContext(Context);
  const location = useLocation();

  const style = "svg-white-filter";
  const [styleObject, ChangeStyleObject] = useState<
    styleObjectType | undefined
  >();

  useEffect(() => {
    if (location.pathname == "/") {
      ChangeStyleObject({
        homeMenuStyle: style,
        moviesMenuStyle: "",
        showsMenuStyle: "",
        bookmarksMenuStyle: "",
      });
    } else if (location.pathname == "/shows") {
      ChangeStyleObject({
        homeMenuStyle: "",
        moviesMenuStyle: "",
        showsMenuStyle: style,
        bookmarksMenuStyle: "",
      });
    } else if (location.pathname == "/bookmarks") {
      ChangeStyleObject({
        homeMenuStyle: "",
        moviesMenuStyle: "",
        showsMenuStyle: "",
        bookmarksMenuStyle: style,
      });
    } else if (location.pathname == "/movies") {
      ChangeStyleObject({
        homeMenuStyle: "",
        moviesMenuStyle: style,
        showsMenuStyle: "",
        bookmarksMenuStyle: "",
      });
    }
  }, [location.pathname]);

  return (
    <>
      <div className="flex items-center justify-between w-full p-[4.8vw] h-[14.93vw] bg-[#161D2F] text-white mb-[6.4vw]">
        <Link to="/">
          <img className="w-[6.67vw] h-[5.33vw]" src="../../assets/logo.svg" />
        </Link>
        <Navigation styleObject={styleObject} />
        <img
          className="w-[6.4vw] h-[6.4vw] border border-white rounded-full"
          onClick={() => {
            if (!userModal) {
              setUserModal(true);
            } else {
              setUserModal(false);
            }
          }}
          src="../../assets/image-avatar.png"
        />
        <div
          className={
            !userModal
              ? "hidden"
              : "block absolute z-20 mt-[14.93vw] p-6 top-0 right-0 w-[53.33vw] h-auto bg-[#161D2F] rounded-bl-xl"
          }
        >
          <ul>
            <li
              onClick={() => {
                setLoggedInStatus(false);
                setUserModal(false);
              }}
              className="pl-4 pb-2 float-left clear-both text-[3.73vw]"
            >
              Logout
            </li>
          </ul>
        </div>
      </div>
      <div
        className={
          !userModal
            ? "hidden"
            : "fixed top-0 z-10 left-0 mt-[14.93vw] block w-full h-screen bg-black opacity-70"
        }
        onClick={() => setUserModal(false)}
      ></div>
    </>
  );
}

export default Header;
