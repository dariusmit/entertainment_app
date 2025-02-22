import axios from "axios";
import { Context } from "../context/StoreContext";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import toastSettings from "../helpers/toastSettings";

function LoginForm() {
  const { inputError, setInputError, emptyErrorObject } = useContext(Context);
  const [isPassVisible, setPassVisibility] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const { setAccessToken, setUser, user, isLoading } = useContext(AuthContext);

  useEffect(() => {
    setInputError(emptyErrorObject);
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    const emailError = !email ? "Email can't be empty!" : "";
    const passEmptyErr = !password ? "Password can't be empty!" : "";

    setInputError((prev) => {
      return {
        ...prev,
        emailError: emailError,
        passErrors: { ...prev.passErrors, passEmptyErr: passEmptyErr },
      };
    });

    if (emailError || passEmptyErr) {
      return;
    }

    try {
      const res = await axios.post(
        "https://entertainment-app-wheat.vercel.app/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.message === "Login successful") {
        setAccessToken(res.data.accessToken);
        const decodedUser = jwtDecode(res.data.accessToken) as {
          id: number;
          email: string;
        };
        setUser(decodedUser);
        navigate("/");
        // Reset form
        setEmail("");
        setPassword("");
        setInputError(emptyErrorObject);
      }
    } catch (err: any) {
      toast.error("Incorrect credentials!", toastSettings);
    }
  }

  return (
    <div className="flex flex-col items-center m-[6.4vw] tablet:mt-[10.42vw] tablet:mx-[23.96vw] desktop:mt-[5.42vw] desktop:mx-[36.11vw]">
      <img
        className="w-[8.53vw] h-auto mb-[15.47vw] tablet:w-[4.17vw] tablet:mb-[9.38vw] desktop:w-[2.22vw] desktop:mb-[5.76vw]"
        src="../../assets/logo.svg"
      />
      <form
        className="bg-[#161D2F] w-full h-auto rounded-2xl p-[6.4vw] tablet:p-[4.17vw] desktop:p-[2.22vw]"
        onSubmit={handleSubmit}
      >
        <h1 className="text-[8.53vw] font-light tracking-[-0.13vw] mb-[6.67vw] tablet:text-[4.17vw] tablet:mb-[4.21vw] desktop:text-[2.22vw] desktop:mb-[2.78vw]">
          Login
        </h1>
        <h1 className="text-[4vw] ml-3 text-gray-300 mb-2 tablet:text-[1.95vw] desktop:text-[1.04vw]">
          Test users:
        </h1>
        <div className="flex mb-4 ml-3">
          <div className="text-gray-400 font-extralight text-[3vw] mr-6 tablet:text-[1.6vw] desktop:text-[0.9vw]">
            <p>root@root.com</p>
            <p>root</p>
          </div>
          <div className="text-gray-400 font-extralight text-[3vw] tablet:text-[1.6vw] desktop:text-[0.9vw]">
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
                maxLength={50}
                placeholder="Email address"
                onFocus={(event) => {
                  event.target.setAttribute("autocomplete", "off");
                }}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="font-extralight text-[4vw] bg-[#161D2F] p-3 border-b border-b-[#5A698F] mb-4 w-full tablet:text-[1.95vw] desktop:text-[1.04vw]"
              />
              {inputError.emailError && (
                <p className="text-[3vw] font-extralight mb-3 text-red-500 tablet:text-[1.6vw] desktop:text-[0.9vw]">
                  {inputError.emailError}
                </p>
              )}
            </div>
          </div>
          <div className="flex">
            <div className="w-full">
              <div className="relative flex">
                <input
                  type={isPassVisible ? "text" : "password"}
                  name="password"
                  maxLength={50}
                  value={password}
                  placeholder="Password"
                  onFocus={(event) => {
                    event.target.setAttribute("autocomplete", "off");
                  }}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`font-extralight text-[4vw] bg-[#161D2F] p-3 border-b border-b-[#5A698F] mb-4 tablet:text-[1.95vw] desktop:text-[1.04vw] ${
                    inputError.passErrors.passEmptyErr
                      ? `mb-2`
                      : `mb-[10.67vw] tablet:mb-[5.2vw] desktop:mb-[2.78vw]`
                  } w-full`}
                />
                <button
                  className={
                    password !== "" ? "block absolute center-login" : "hidden"
                  }
                  type="button"
                  onClick={() => setPassVisibility((prev) => !prev)}
                >
                  <div className="flex items-center justify-center mb-2 w-[8vw] h-[6.66vw] tablet:w-[3.9vw] tablet:h-[3.25vw] desktop:w-[2.08vw] desktop:h-[1.73vw]">
                    {isPassVisible ? (
                      <img
                        className="w-[5.33vw] tablet:w-[2.6vw] desktop:w-[1.39vw] h-auto"
                        src="../../assets/open-eye.svg"
                      />
                    ) : (
                      <img
                        className="w-[5.33vw] tablet:w-[2.6vw] desktop:w-[1.39vw] h-auto"
                        src="../../assets/closed-eye.svg"
                      />
                    )}
                  </div>
                </button>
              </div>
              {inputError.passErrors.passEmptyErr && (
                <p className="text-[3vw] font-extralight text-red-500 mb-[10.67vw] tablet:mb-[5.2vw] tablet:text-[1.6vw] desktop:text-[0.9vw] desktop:mb-[2.78vw]">
                  {inputError.passErrors.passEmptyErr}
                </p>
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#FC4747] text-[4vw] mb-[6.4vw] font-extralight rounded-md py-[4vw] flex justify-center items-center w-full tablet:text-[1.95vw] tablet:mb-[3.13vw] tablet:py-[1.82vw] desktop:text-[1.04vw] desktop:mb-[1.67vw] desktop:py-[1.04vw]"
        >
          Login to your account
        </button>
        <p className="text-center text-[4vw] font-extralight tablet:text-[1.95vw] desktop:text-[1.04vw]">
          Don't have an account?{" "}
          <Link className="text-[#FC4747]" to="/register">
            Sign Up
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
}

export default LoginForm;
