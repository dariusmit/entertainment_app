import axios from "axios";
import { Context } from "../context/storeContext";
import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const {
    setUserID,
    inputError,
    setInputError,
    setLoggedInStatus,
    setAccessToken,
    setRefreshToken,
  } = useContext(Context);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (!email || !password) {
      setInputError("Fields can't be empty!");
      return;
    }
    axios
      .post("http://localhost:8091/login", { email, password })
      .then((res) => {
        if (res.data.message === "Login successful") {
          setAccessToken(res.data.accessToken);
          //setRefreshToken(res.data.refreshToken);
          setInputError("");
          navigate("/");
          setLoggedInStatus(true);
          setUserID(res.data.user[0].user_id);
        } else {
          setInputError(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="flex flex-col items-center m-[6.4vw]">
      <img
        className="w-[8.53vw] h-auto mb-[15.47vw]"
        src="../../assets/logo.svg"
      />
      <form
        className="bg-[#161D2F] w-full h-auto rounded-2xl p-[6.4vw]"
        onSubmit={handleSubmit}
      >
        <h1 className="text-[8.53vw] font-light tracking-[-0.13vw] mb-[6.67vw]">
          Login
        </h1>
        <div>
          <div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                autoComplete="nope"
                onChange={(e) => setEmail(e.target.value)}
                className="font-extralight text-[4vw] bg-[#161D2F] p-3 border-b border-b-[#5A698F] mb-2 w-full"
              />
            </div>
          </div>
          <div className="flex min-[1024px]:w-[50%]">
            <div className="w-full">
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="nope"
                onChange={(e) => setPassword(e.target.value)}
                className="font-extralight text-[4vw] bg-[#161D2F] p-3 border-b border-b-[#5A698F] mb-[8.67vw] w-full"
              />
            </div>
          </div>
          <p className="text-[4vw] font-extralight mt-[-20px] mb-[8.67vw] text-red-500">
            {inputError}
          </p>
        </div>
        <button
          type="submit"
          className="bg-[#FC4747] text-[4vw] mb-[6.4vw] font-extralight rounded-md py-[4vw] flex justify-center items-center w-full"
        >
          Login to your account
        </button>
        <p className="text-center text-[4vw] font-extralight">
          Don't have an account?{" "}
          <Link className="text-[#FC4747]" to="/register">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
