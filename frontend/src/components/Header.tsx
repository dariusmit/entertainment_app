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
  const { userModal, setUserModal, setLoggedInStatus } = useContext(Context);
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
        "http://localhost:8081/logout",
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
              : "block absolute z-50 mt-[14.93vw] p-6 top-0 right-0 w-[53.33vw] h-auto bg-[#161D2F] rounded-bl-xl"
          }
        >
          <ul>
            <li className="flex pl-4 mb-6 float-left clear-both font-light text-[3.5vw]">
              <p className="mr-2 text-gray-200">Hey,</p>
              <p className="text-[#FC4747]"> {user!.email}</p>
            </li>
            <li
              onClick={() => {
                setLoggedInStatus(false);
                setUserModal(false);
                logout();
              }}
              className="pl-4 pb-2 float-left text-gray-200 clear-both font-light text-[3.5vw]"
            >
              - Logout -
            </li>
          </ul>
        </div>
      </div>
      <div
        className={
          !userModal
            ? "hidden"
            : "fixed top-0 z-40 left-0 mt-[14.93vw] block w-full h-screen bg-black opacity-70"
        }
        onClick={() => setUserModal(false)}
      ></div>
    </>
  );
}

export default Header;
