import axios from "axios";
import { Context } from "../context/storeContext";
import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function RegistrationForm() {
  const { isLoggedIn } = useContext(Context);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatedPassword, setRepeatedPassword] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (password === repeatedPassword) {
      axios
        .post("http://localhost:8081/register", { email, password })
        .then((res) => {
          setInputError("");
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      setInputError("Passwords does not match!");
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
          Sign Up
        </h1>
        <div>
          <div>
            <div>
              <input
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                className="font-extralight text-[4vw] bg-[#161D2F] p-3 border-b border-b-[#5A698F] mb-2 w-full"
              />
            </div>
          </div>
          <div className="flex min-[1024px]:w-[50%]">
            <div className="w-full">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="font-extralight text-[4vw] bg-[#161D2F] p-3 border-b border-b-[#5A698F] mb-2 w-full"
              />
            </div>
          </div>
          <div className="flex min-[1024px]:w-[50%]">
            <div className="w-full">
              <input
                type="password"
                placeholder="Repeat Password"
                onChange={(e) => setRepeatedPassword(e.target.value)}
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
          Create an account
        </button>
        <p className="text-center text-[4vw] font-extralight">
          Already have an account?{" "}
          <Link className="text-[#FC4747]" to="/login">
            Login
          </Link>
        </p>
      </form>
      {isLoggedIn && <p>User is Logged In!</p>}
    </div>
  );
}

export default RegistrationForm;