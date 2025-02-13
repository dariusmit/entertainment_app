import axios from "axios";
import { Context } from "../context/StoreContext";
import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import formValidation from "../validation/formValidation";
import toastSettings from "../helpers/toastSettings";

function RegistrationForm() {
  const { inputError, setInputError, emptyErrorObject } = useContext(Context);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatedPassword, setRepeatedPassword] = useState<string>("");
  const formValidRef = useRef<boolean>(false);
  const location = useLocation();

  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
  const [isPassVisible, setPassVisibility] = useState<boolean>(false);

  const [isRepeatPassVisible, setRepeatPassVisibility] =
    useState<boolean>(false);

  useEffect(() => {
    formValidation(
      email,
      password,
      repeatedPassword,
      setInputError,
      isSubmitClicked,
      formValidRef,
      setIsSubmitClicked
    );
  }, [email, password, repeatedPassword, isSubmitClicked]);

  useEffect(() => {
    setInputError(emptyErrorObject);
  }, [location.pathname]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    setIsSubmitClicked(true);

    if (formValidRef.current === true) {
      axios
        .post("http://localhost:8081/register", { email, password })
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.error, toastSettings);
            return;
          }
          toast.success("User Created! You can sign in now.", toastSettings);
        })
        .catch((err) => console.log(err));

      formValidRef.current = false;
      setEmail("");
      setPassword("");
      setRepeatedPassword("");
      setInputError(emptyErrorObject);
      setIsSubmitClicked(false);
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
        noValidate
      >
        <h1 className="text-[8.53vw] font-light tracking-[-0.13vw] mb-[6.67vw] tablet:text-[4.17vw] tablet:mb-[4.21vw] desktop:text-[2.22vw] desktop:mb-[1vw]">
          Sign Up
        </h1>
        <div>
          <div>
            <div>
              <input
                type="email"
                name="email"
                maxLength={50}
                value={email}
                placeholder="Email address"
                autoComplete="no"
                onChange={(e) => setEmail(e.target.value)}
                className="font-extralight foutline-hidden text-[4vw] bg-[#161D2F] p-3 border-b border-b-[#5A698F] mb-2 w-full tablet:text-[1.95vw] desktop:text-[1.04vw]"
              />
              <p className="text-[3vw] font-extralight mb-3 text-red-500 tablet:text-[1.6vw] desktop:text-[0.9vw]">
                {inputError.emailError}
              </p>
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
                  autoComplete="no"
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-extralight w-full text-[4vw] bg-[#161D2F] p-3 border-b border-b-[#5A698F] mb-2 tablet:text-[1.95vw] desktop:text-[1.04vw]"
                />
                <button
                  className={
                    password !== "" ? "block absolute center" : "hidden"
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
              {
                <ul className="ml-4 text-[3vw] list-disc font-extralight mb-3 text-red-500 tablet:text-[1.6vw] desktop:text-[0.9vw]">
                  {inputError.passErrors.passEmptyErr && (
                    <li className="list-none ml-[-1rem]">
                      {inputError.passErrors.passEmptyErr}
                    </li>
                  )}
                  {inputError.passErrors.passCritErr1 && (
                    <li>{inputError.passErrors.passCritErr1}</li>
                  )}
                  {inputError.passErrors.passCritErr2 && (
                    <li>{inputError.passErrors.passCritErr2}</li>
                  )}
                  {inputError.passErrors.passCritErr3 && (
                    <li>{inputError.passErrors.passCritErr3}</li>
                  )}
                  {inputError.passErrors.passCritErr4 && (
                    <li>{inputError.passErrors.passCritErr4}</li>
                  )}
                  {inputError.passErrors.passCritErr5 && (
                    <li>{inputError.passErrors.passCritErr5}</li>
                  )}
                </ul>
              }
            </div>
          </div>
          <div className="flex">
            <div className="w-full">
              <div className="relative flex">
                <input
                  type={isRepeatPassVisible ? "text" : "password"}
                  name="repeat_password"
                  maxLength={50}
                  value={repeatedPassword}
                  placeholder="Repeat Password"
                  autoComplete="no"
                  onChange={(e) => setRepeatedPassword(e.target.value)}
                  className="font-extralight text-[4vw] bg-[#161D2F] mb-3 p-3 border-b border-b-[#5A698F] w-full tablet:text-[1.95vw] desktop:text-[1.04vw]"
                />
                <button
                  className={
                    repeatedPassword !== "" ? "block absolute center" : "hidden"
                  }
                  type="button"
                  onClick={() => setRepeatPassVisibility((prev) => !prev)}
                >
                  <div className="flex items-center justify-center mb-2 w-[8vw] h-[6.66vw] tablet:w-[3.9vw] tablet:h-[3.25vw] desktop:w-[2.08vw] desktop:h-[1.73vw]">
                    {isRepeatPassVisible ? (
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
              <p className="text-[3vw] font-extralight mb-[8.67vw] text-red-500 tablet:text-[1.6vw] tablet:mb-[5.2vw] desktop:text-[0.9vw] desktop:mb-[2.78vw]">
                {inputError.repeatPassError}
              </p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#FC4747] text-[4vw] mb-[6.4vw] font-extralight rounded-md py-[4vw] flex justify-center items-center w-full tablet:text-[1.95vw] tablet:mb-[3.13vw] tablet:py-[1.82vw] desktop:text-[1.04vw] desktop:mb-[1.67vw] desktop:py-[1.04vw]"
        >
          Create an account
        </button>
        <p className="text-center text-[4vw] font-extralight tablet:text-[1.95vw] desktop:text-[1.04vw]">
          Already have an account?{" "}
          <Link className="text-[#FC4747]" to="/login">
            Login
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
}

export default RegistrationForm;
