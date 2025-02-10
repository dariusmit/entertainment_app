import axios from "axios";
import { Context } from "../context/StoreContext";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import formValid from "../validation/formValidation";
import useDebounce from "../hooks/useDebounce";

function RegistrationForm() {
  const { inputError, setInputError, emptyErrorObject } = useContext(Context);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatedPassword, setRepeatedPassword] = useState<string>("");

  //Too much states I think
  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
  const [isPassVisible, setPassVisibility] = useState<boolean>(false);

  const [isRepeatPassVisible, setRepeatPassVisibility] =
    useState<boolean>(false);

  const toastSettings: object = {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "dark",
  };
  useEffect(() => {
    formValid(
      email,
      password,
      repeatedPassword,
      inputError,
      setInputError,
      isSubmitClicked
    );
  }, [email, password, repeatedPassword]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    setIsSubmitClicked(true);
    console.log(
      JSON.stringify(email),
      JSON.stringify(password),
      JSON.stringify(repeatedPassword)
    );
    console.log(typeof email, typeof password, typeof repeatedPassword);
    console.log(email === "" && password === "" && repeatedPassword === "");

    /**
      axios
        .post("http://localhost:8081/register", { email, password })
        .then((res) => {
          if (!res.data.emailExists) {
            setInputError(resetErrors);
            toast.success("User Created! You can sign in now.", toastSettings);
          } else {
            setInputError({
              ...inputError,
              emailError: "Email already in use!",
            });
          }
        })
        .catch((err) => console.log(err));
        */
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
        noValidate
      >
        <h1 className="text-[8.53vw] font-light tracking-[-0.13vw] mb-[6.67vw]">
          Sign Up
        </h1>
        <div>
          <div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                autoComplete="no"
                onChange={(e) => setEmail(e.target.value)}
                className="font-extralight text-[4vw] bg-[#161D2F] p-3 border-b border-b-[#5A698F] mb-2 w-full"
              />
              <p className="text-[3vw] font-extralight mb-3 text-red-500">
                {inputError.emailError}
              </p>
            </div>
          </div>
          <div className="flex min-[1024px]:w-[50%]">
            <div className="w-full">
              <div className="relative flex">
                <input
                  type={isPassVisible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  autoComplete="no"
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-extralight w-full text-[4vw] bg-[#161D2F] p-3 border-b border-b-[#5A698F] mb-2"
                />
                <button
                  className={
                    password !== "" ? "block absolute center" : "hidden"
                  }
                  onClick={() =>
                    isPassVisible
                      ? setPassVisibility(false)
                      : setPassVisibility(true)
                  }
                >
                  <div className="flex items-center justify-center mb-2 w-[30px] h-[25px]">
                    {isPassVisible ? (
                      <img
                        className="w-[20px] h-auto"
                        src="../../assets/open-eye.svg"
                      />
                    ) : (
                      <img
                        className="w-[20px] h-auto"
                        src="../../assets/closed-eye.svg"
                      />
                    )}
                  </div>
                </button>
              </div>
              <p className="text-[3vw] font-extralight text-red-500">
                {inputError.passErrors.passGlobalErr}
              </p>
              {inputError.passErrors.passGlobalErr !== "" && (
                <ul className="ml-4 text-[3vw] list-disc font-extralight mb-3 text-red-500">
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
              )}
            </div>
          </div>
          <div className="flex min-[1024px]:w-[50%]">
            <div className="w-full">
              <div className="relative flex">
                <input
                  type={isRepeatPassVisible ? "text" : "password"}
                  name="repeat_password"
                  placeholder="Repeat Password"
                  autoComplete="no"
                  onChange={(e) => setRepeatedPassword(e.target.value)}
                  className="font-extralight text-[4vw] bg-[#161D2F] mb-2 p-3 border-b border-b-[#5A698F] w-full"
                />
                <button
                  className={
                    repeatedPassword !== "" ? "block absolute center" : "hidden"
                  }
                  onClick={() =>
                    isRepeatPassVisible
                      ? setRepeatPassVisibility(false)
                      : setRepeatPassVisibility(true)
                  }
                >
                  <div className="flex items-center justify-center mb-2 w-[30px] h-[25px]">
                    {isRepeatPassVisible ? (
                      <img
                        className="w-[20px] h-auto"
                        src="../../assets/open-eye.svg"
                      />
                    ) : (
                      <img
                        className="w-[20px] h-auto"
                        src="../../assets/closed-eye.svg"
                      />
                    )}
                  </div>
                </button>
              </div>
              <p className="text-[3vw] font-extralight mb-[8.67vw] text-red-500">
                {inputError.repeatPassError}
              </p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#FC4747] text-[4vw] mb-[6.4vw] font-extralight rounded-md py-[4vw] flex justify-center items-center w-full"
        >
          Create an account
        </button>
        <p className="text-center text-[4vw] font-extralight">
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
