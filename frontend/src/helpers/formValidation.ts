import inputErrorsType from "../types/inputErrorsType";

function formValid(
  email: string,
  password: string,
  repeatedPassword: string,
  inputError: inputErrorsType,
  setInputError: React.Dispatch<React.SetStateAction<inputErrorsType>>,
  setshowPassCriteria: React.Dispatch<React.SetStateAction<boolean>>
): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  //Check if fields are empty
  if (!email || email === "") {
    setInputError((prev) => {
      return { ...prev, emailError: "Email can't be empty!" };
    });
  }
  if (!password || password === "") {
    setInputError((prev) => {
      return { ...prev, passError: "Password can't be empty!" };
    });
  }
  if (!repeatedPassword || repeatedPassword === "") {
    setInputError((prev) => {
      return { ...prev, repeatPassError: "Repeat password can't be empty!" };
    });
  }

  //If not empty validate each
  if (email !== "" && !emailRegex.test(email)) {
    setInputError((prev) => {
      return { ...prev, emailError: "Email is not valid!" };
    });
  } else {
    setInputError((prev) => {
      return { ...prev, emailError: "" };
    });
  }
  if (password !== "" && !passRegex.test(password)) {
    setInputError((prev) => {
      return {
        ...prev,
        passError: "Password should meet:",
      };
    });
    setshowPassCriteria(true);
  } else {
    setInputError((prev) => {
      return {
        ...prev,
        passError: "",
      };
    });
    setshowPassCriteria(false);
  }
  if (repeatedPassword !== "" && repeatedPassword !== password) {
    setInputError((prev) => {
      return {
        ...prev,
        repeatPassError: "Repeat password does not match password!",
      };
    });
  } else {
    setInputError((prev) => {
      return {
        ...prev,
        repeatPassError: "",
      };
    });
  }

  //If no errors return true else false
  if (Object.keys(inputError).length === 0) {
    return true;
  } else {
    return false;
  }
}

export default formValid;
