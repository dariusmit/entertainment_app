import inputErrorsType from "../../types/inputErrorsType";

function emptyErrors(
  email: string,
  password: string,
  repeatedPassword: string,
  setInputError: React.Dispatch<React.SetStateAction<inputErrorsType>>
) {
  if (!email || email === "") {
    console.log("email is empty throwing error");
    setInputError((prev) => {
      return { ...prev, emailError: "Email can't be empty!" };
    });
  }
  if (!password || password === "") {
    setInputError((prev) => {
      return {
        ...prev,
        passErrors: {
          ...prev.passErrors,
          passGlobalErr: "Password can't be empty!",
        },
      };
    });
  }
  if (!repeatedPassword || repeatedPassword === "") {
    setInputError((prev) => {
      return { ...prev, repeatPassError: "Repeat password can't be empty!" };
    });
  }
}

export default emptyErrors;
