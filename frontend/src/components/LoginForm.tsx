import axios from "axios";
import { Context } from "../context/StoreContext";
import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

function LoginForm() {
  const { inputError, setInputError, emptyErrorObject } = useContext(Context);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
  const isFromValid = useRef<boolean>(false);

  const { setAccessToken } = useContext(AuthContext);

  useEffect(() => {
    setInputError(emptyErrorObject);
  }, [location.pathname]);

  useEffect(() => {
    if (isSubmitClicked) {
      setInputError((prev) => {
        return {
          ...prev,
          emailError: `${!email ? `Email can't be empty!` : ``}`,
        };
      });
      setInputError((prev) => {
        return {
          ...prev,
          passErrors: {
            ...prev.passErrors,
            passEmptyErr: `${!password ? `Password can't be empty!` : ``}`,
          },
        };
      });
    }

    const hasErrors =
      email === "" ||
      password === "" ||
      inputError.emailError !== "" ||
      inputError.passErrors.passEmptyErr !== "";

    isFromValid.current = !hasErrors;
  }, [email, password, isSubmitClicked]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    setIsSubmitClicked(true);

    if (!email || !password) {
      return;
    }

    if (isFromValid.current === true) {
      axios
        .post(
          "http://localhost:8081/login",
          { email, password },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.message === "Login successful") {
            setAccessToken(res.data.accessToken);
            setInputError(emptyErrorObject);
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

      isFromValid.current = false;
      setEmail("");
      setPassword("");
      setInputError(emptyErrorObject);
      setIsSubmitClicked(false);
    }
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
        <h1 className="text-[4vw] text-gray-300 mb-2">Test users:</h1>
        <div className="flex mb-4">
          <div className="text-gray-400 font-extralight text-[3vw] mr-6">
            <p>root@root.com</p>
            <p>root</p>
          </div>
          <div className="text-gray-400 font-extralight text-[3vw]">
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
                className="font-extralight text-[4vw] bg-[#161D2F] p-3 border-b border-b-[#5A698F] mb-4 w-full"
              />
              {inputError.emailError && (
                <p className="text-[3vw] font-extralight mb-3 text-red-500">
                  {inputError.emailError}
                </p>
              )}
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
                className={`font-extralight text-[4vw] bg-[#161D2F] p-3 border-b border-b-[#5A698F] ${
                  inputError.passErrors.passEmptyErr ? `mb-2` : `mb-[10.67vw]`
                } w-full`}
              />
              {inputError.passErrors.passEmptyErr && (
                <p className="text-[3vw] font-extralight text-red-500 mb-[10.67vw]">
                  {inputError.passErrors.passEmptyErr}
                </p>
              )}
            </div>
          </div>
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
