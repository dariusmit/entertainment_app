import inputErrorsType from "../types/inputErrorsType";
import emptyErrors from "./functions/emptyErrors";

function formValid(
  email: string,
  password: string,
  repeatedPassword: string,
  inputError: inputErrorsType,
  setInputError: React.Dispatch<React.SetStateAction<inputErrorsType>>,
  isSubmitClicked: boolean
): boolean {
  // Email Regex to be valid format - a@a.com
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password Regex patterns
  const minLengthRegex = /.{8,}/; // At least 8 characters
  const lowercaseRegex = /[a-z]/; // At least one lowercase letter
  const uppercaseRegex = /[A-Z]/; // At least one uppercase letter
  const numberRegex = /\d/; // At least one number
  const specialCharRegex = /[@$!%*?&]/; // At least one special character

  //Empty field errors
  if (isSubmitClicked) {
    emptyErrors(email, password, repeatedPassword, setInputError);
  }

  //Email validation
  if (email !== "" && !emailRegex.test(email)) {
    setInputError((prev) => {
      return { ...prev, emailError: "Email is not valid!" };
    });
  } else {
    setInputError((prev) => {
      return { ...prev, emailError: "" };
    });
  }

  //Password Validation
  if (password !== "") {
    setInputError((prev) => {
      return {
        ...prev,
        passErrors: {
          ...prev.passErrors,
          passGlobalErr: "Password should meet:",
        },
      };
    });
    if (!minLengthRegex.test(password)) {
      setInputError((prev) => {
        return {
          ...prev,
          passErrors: {
            ...prev.passErrors,
            passCritErr1: "At least 8 characters",
          },
        };
      });
    } else {
      setInputError((prev) => {
        return {
          ...prev,
          passErrors: {
            ...prev.passErrors,
            passCritErr1: "",
          },
        };
      });
    }
    if (!uppercaseRegex.test(password)) {
      setInputError((prev) => {
        return {
          ...prev,
          passErrors: {
            ...prev.passErrors,
            passCritErr2: "At least one uppercase letter (A-Z)",
          },
        };
      });
    } else {
      setInputError((prev) => {
        return {
          ...prev,
          passErrors: {
            ...prev.passErrors,
            passCritErr2: "",
          },
        };
      });
    }
    if (!lowercaseRegex.test(password)) {
      setInputError((prev) => {
        return {
          ...prev,
          passErrors: {
            ...prev.passErrors,
            passCritErr3: "At least one lowercase letter (a-z)",
          },
        };
      });
    } else {
      setInputError((prev) => {
        return {
          ...prev,
          passErrors: {
            ...prev.passErrors,
            passCritErr3: "",
          },
        };
      });
    }
    if (!numberRegex.test(password)) {
      setInputError((prev) => {
        return {
          ...prev,
          passErrors: {
            ...prev.passErrors,
            passCritErr4: "At least one digit (0-9)",
          },
        };
      });
    } else {
      setInputError((prev) => {
        return {
          ...prev,
          passErrors: {
            ...prev.passErrors,
            passCritErr4: "",
          },
        };
      });
    }
    if (!specialCharRegex.test(password)) {
      setInputError((prev) => {
        return {
          ...prev,
          passErrors: {
            ...prev.passErrors,
            passCritErr5: "At least one special character (@#$%^&*! etc.)",
          },
        };
      });
    } else {
      setInputError((prev) => {
        return {
          ...prev,
          passErrors: {
            ...prev.passErrors,
            passCritErr5: "",
          },
        };
      });
    }
    if (
      inputError.passErrors.passCritErr1 === "" &&
      inputError.passErrors.passCritErr2 === "" &&
      inputError.passErrors.passCritErr3 === "" &&
      inputError.passErrors.passCritErr4 === "" &&
      inputError.passErrors.passCritErr5 === "" &&
      password != ""
    ) {
      setInputError((prev) => {
        return {
          ...prev,
          passErrors: {
            ...prev.passErrors,
            passGlobalErr: "",
          },
        };
      });
    }
  } else {
    setInputError((prev) => {
      return {
        ...prev,
        passErrors: {
          passGlobalErr: "",
          passCritErr1: "",
          passCritErr2: "",
          passCritErr3: "",
          passCritErr4: "",
          passCritErr5: "",
        },
      };
    });
  }

  //Repeat password check for match
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

  //If no validation errors return true, else false
  if (
    email != "" &&
    password != "" &&
    repeatedPassword != "" &&
    inputError.emailError === "" &&
    inputError.passErrors.passGlobalErr === "" &&
    inputError.passErrors.passCritErr1 === "" &&
    inputError.passErrors.passCritErr2 === "" &&
    inputError.passErrors.passCritErr3 === "" &&
    inputError.passErrors.passCritErr4 === "" &&
    inputError.passErrors.passCritErr5 === "" &&
    inputError.repeatPassError === ""
  ) {
    console.log("form data is valid and can be submitted");
    return true;
  } else {
    console.log("incorrect data, form can't be submitted");
    return false;
  }
}

export default formValid;
