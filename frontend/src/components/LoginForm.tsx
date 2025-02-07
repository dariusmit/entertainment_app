import axios from "axios";
import { Context } from "../context/StoreContext";
import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

function LoginForm() {
  const { inputError, setInputError } = useContext(Context);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const { setAccessToken } = useContext(AuthContext);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (!email || !password) {
      setInputError("Fields can't be empty!");
      return;
    }
    axios
      .post(
        "http://localhost:8081/login",
        { email, password },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.message === "Login successful") {
          setAccessToken(res.data.accessToken);
          setInputError("");
          navigate("/");
          const accessToken = res.data.accessToken;
          const decodedUser = jwtDecode(accessToken);

          // Cast decoded user to CustomJwtPayload type
          const user = decodedUser as { id: number; email: string };

          setUser(user);
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
        <h1 className="undeline text-gray-300 mb-4">Test users:</h1>
        <div className="flex mb-4">
          <div className="text-gray-400 text-[3vw] mr-6">
            <p>root@root.com</p>
            <p>root</p>
          </div>
          <div className="text-gray-400 text-[3vw]">
            <p>test@test.com</p>
            <p>test</p>
          </div>
        </div>

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
