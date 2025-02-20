import { useContext } from "react";
import Navigation from "./Navigation";
import { Context } from "../context/StoreContext";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { axiosJWT, config } from "../axios/axios";
import { useEffect, useState } from "react";
import styleObjectType from "../types/styleObjectType";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { userModal, setUserModal, changeSearchValue, setSearchCompletion } =
    useContext(Context);
  const location = useLocation();

  const { user, setUser, setAccessToken, accessToken } =
    useContext(AuthContext);

  const navigate = useNavigate();

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

  const logout = async () => {
    try {
      await axiosJWT.post(
        "https://entertainment-app-wheat.vercel.app/logout",
        {},
        config(accessToken)
      );
      setUser(null);
      navigate("/login");
      setAccessToken("");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-between w-full p-[4.8vw] h-[14.93vw] bg-[#161D2F] text-white mb-[6.4vw]
      tablet:m-[3.25vw] tablet:relative tablet:z-50 tablet:rounded-lg tablet:w-auto tablet:p-[3.13vw] tablet:h-[9.36vw]
      desktop:m-[1.95vw] desktop:fixed desktop:left-0 z-40 desktop:top-0 desktop:flex-col desktop:h-[90%] desktop:w-[6vw] desktop:p-[1.8vw] desktop:rounded-2xl desktop:justify-start"
      >
        <Link to="/">
          <img
            className="w-[6.67vw] h-[5.33vw] tablet:w-[4.16vw] tablet:h-auto desktop:w-[2.22vw] desktop:h-[1.8vw] desktop:mb-[5.2vw] desktop:mt-2 desktop:hover:scale-110 desktop:ease-in-out duration-150 "
            src="../../assets/logo.svg"
          />
        </Link>
        <Navigation
          styleObject={styleObject}
          changeSearchValue={changeSearchValue}
          setSearchCompletion={setSearchCompletion}
        />
        <div
          className="flex bg-gray-950 items-center justify-center w-[6.4vw] h-[6.4vw] border border-white rounded-full tablet:hover:cursor-pointer tablet:w-[4.17vw] tablet:h-[4.17vw] 
          desktop:w-[2.78vw] desktop:h-[2.78vw] desktop:absolute desktop:bottom-0 desktop:mb-[2.12vw] desktop:hover:border-2 desktop:hover:border-[#FC4747] desktop:hover:text-[#FC4747]"
          onClick={() => {
            if (!userModal) {
              setUserModal(true);
            } else {
              setUserModal(false);
            }
          }}
        >
          <p className="text-lg tablet:text-2xl desktop:text-3xl">
            {user?.email[0].toUpperCase()}
          </p>
        </div>
        <div
          className={
            !userModal
              ? "hidden"
              : "block absolute z-50 mt-[14.93vw] p-6 top-0 right-0 w-auto h-auto bg-[#161D2F] rounded-bl-xl tablet:mt-[9vw] tablet:rounded-b-lg" +
                " desktop:top-auto desktop:right-auto desktop:left-24 desktop:bottom-0 desktop:rounded-r-lg desktop:rounded-bl-none"
          }
        >
          <ul>
            <li className="flex pl-2 mb-6 float-left clear-both font-light text-[3.5vw] tablet:text-[2vw] desktop:text-[1vw]">
              <p className="mr-2 text-gray-200">Hey,</p>
              <p className="text-[#FC4747]"> {user!.email}</p>
            </li>
            <li
              onClick={() => {
                setUserModal(false);
                logout();
              }}
              className="pl-4 pb-2 float-left text-gray-200 clear-both font-light text-[3.5vw] tablet:text-[2vw] desktop:text-[1vw] desktop:hover:cursor-pointer desktop:hover:underline desktop:hover:underline-offset-8"
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
            : "fixed top-0 z-40 left-0 mt-[14.93vw] block w-full h-screen bg-black opacity-70 tablet:mt-0"
        }
        onClick={() => setUserModal(false)}
      ></div>
    </>
  );
}

export default Header;
