import { useContext } from "react";
import Navigation from "./Navigation";
import { Context } from "../context/storeContext";
import { Link } from "react-router-dom";

function Header() {
  const { userModal, setUserModal, setLoggedInStatus } = useContext(Context);

  return (
    <>
      <div className="flex items-center justify-between w-full p-[4.8vw] h-[14.93vw] bg-[#161D2F] text-white mb-[6.4vw]">
        <Link to="/">
          <img className="w-[6.67vw] h-[5.33vw]" src="../../assets/logo.svg" />
        </Link>
        <Navigation />
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
