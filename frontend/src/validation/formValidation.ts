import inputErrorsType from "../types/inputErrorsType";
import emptyErrors from "./functions/emptyErrors";

function formValidation(
  email: string,
  password: string,
  repeatedPassword: string,
  setInputError: React.Dispatch<React.SetStateAction<inputErrorsType>>,
  isSubmitClicked: boolean,
  formValidRef: React.MutableRefObject<boolean>,
  setIsSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>
): void {
  // Email Regex to be valid format - a@a.com
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password Regex patterns
  const minLengthRegex = /.{8,}/; // At least 8 characters
  const lowercaseRegex = /[a-z]/; // At least one lowercase letter
  const uppercaseRegex = /[A-Z]/; // At least one uppercase letter
  const numberRegex = /\d/; // At least one number
  const specialCharRegex = /[@$!%*?&]/; // At least one special character

  // Step 1: Empty fields errors if submit clicked
  if (isSubmitClicked) {
    emptyErrors(email, password, repeatedPassword, setInputError);
    setIsSubmitClicked(!isSubmitClicked);
  }

  // Step 2: Email validation
  if (email !== "") {
    setInputError((prev) => ({
      ...prev,
      emailError: emailRegex.test(email) ? "" : "Email is not valid!",
    }));
  }

  // Step 3: Password validation
  if (password !== "") {
    setInputError((prev) => ({
      ...prev,
      passErrors: {
        passCritErr1: minLengthRegex.test(password)
          ? ""
          : "At least 8 characters",
        passCritErr2: uppercaseRegex.test(password)
          ? ""
          : "At least one uppercase letter (A-Z)",
        passCritErr3: lowercaseRegex.test(password)
          ? ""
          : "At least one lowercase letter (a-z)",
        passCritErr4: numberRegex.test(password)
          ? ""
          : "At least one digit (0-9)",
        passCritErr5: specialCharRegex.test(password)
          ? ""
          : "At least one special character (@#$%^&*! etc.)",
      },
    }));
  }

  // Step 4: Repeat password validation
  if (repeatedPassword !== "" && password !== "") {
    setInputError((prev) => ({
      ...prev,
      repeatPassError:
        repeatedPassword === password
          ? ""
          : "Repeat password does not match password!",
    }));
  }

  // Step 5: Final form validation
  const hasErrors =
    email === "" ||
    password === "" ||
    repeatedPassword === "" ||
    !emailRegex.test(email) ||
    !minLengthRegex.test(password) ||
    !uppercaseRegex.test(password) ||
    !lowercaseRegex.test(password) ||
    !numberRegex.test(password) ||
    !specialCharRegex.test(password) ||
    repeatedPassword !== password;

  formValidRef.current = !hasErrors;
}

export default formValidation;
