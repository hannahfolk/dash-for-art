export const isPasswordStrong = (password) => {
  return password.length < 6 ? false : true;
};

/**
 * Example:
 * ```js
 * isEmailValid('email@example')     // false
 * isEmailValid('email@example.com') // true
 * ```
 * @description Email must include "at symbol" and "dot" to be valid 
 * @param  {String}  email Email address 
 * @return {Boolean}       If the email is valid or not
 */
export const isEmailValid = (contactEmail) => {
  const valid_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return valid_email.test(contactEmail);
};

/**
 * @description Names are only lowercase or uppercase letters can include "underscores", "apostrophes", "hyphens"
 * @param  {String}  name First name or last name 
 * @return {Boolean}      If the email is valid or not
 * @example 
 * isNameValid("John")       // true
 * isNameValid("Anna-Marie") // true
 * isNameValid("O'Reilly")   // true
 * isNameValid("O'Reilly")   // true
 * isNameValid('O"Reilly')   // false
 * isNameValid("example&")   // false
 * isNameValid("ex.ample")   // false
 */
export const isNameValid = (name) => {
  //eslint-disable-next-line
  var valid_name = /^[a-zA-Z_\-\' ]+$/;
  return valid_name.test(name);
};

export const doesPasswordMatch = (oldString, newString) => {
  return oldString === newString ? true : false;
};

/**
 * @description Phone number matches for numbers, can include "parenthesis", "plus" in front, US (domestic) and some international patterns are valid
 * @param  {String}  phoneNumber Phone Number
 * @return {Boolean}             If the phone number is valid or not
 * @example 
 * isPhoneNumberValid("(123) 456-7890") // true
 * isPhoneNumberValid("123)456-7890")   // true
 * isPhoneNumberValid("123-456-7890")   // true
 * isPhoneNumberValid("123.456.7890")   // true
 * isPhoneNumberValid("1234567890")     // true
 * isPhoneNumberValid("+31636363634")   // true
 * isPhoneNumberValid("075-63546725")   // true
 */
export const isPhoneNumberValid = (phoneNumber) => {
  //eslint-disable-next-line
  var regexPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return regexPhoneNumber.test(phoneNumber);
};

export const areUserFormFieldsValid = (contactEmail, password, captcha) => {
  const error = {
    formPasswordError: "",
    formEmailError: "",
    formCaptchaError: "",
    _formHasErrors: false,
  };

  if (!isPasswordStrong(password)) {
    error.formPasswordError = "Password must be at least 5 characters long.";
    error._formHasErrors = true;
  }

  if (!isEmailValid(contactEmail)) {
    error.formEmailError = "Please Enter A Valid Email";
    error._formHasErrors = true;
  }

  if (captcha !== 200) {
    error.formCaptchaError = "Please verify that you are not a robot.";
    error._formHasErrors = true;
  }

  if (error._formHasErrors) {
    const { formPasswordError, formEmailError, formCaptchaError } = error;
    return {
      formPasswordError,
      formEmailError,
      formCaptchaError,
    };
  } else {
    return false;
  }
};

export const areUserUpdateFormFieldsValid = ({
  newContactEmail,
  newPassword,
  confirmPassword,
}) => {
  const error = {
    errorMessages: [],
    _formHasErrors: false,
  };

  if(!!newPassword) {
    if (!isPasswordStrong(newPassword)) {
      error.errorMessages.push("Password must be at least 5 characters long.");
      error._formHasErrors = true;
    }
    
    if (!doesPasswordMatch(newPassword, confirmPassword)) {
      error.errorMessages.push("Passwords Must Match.");
      error._formHasErrors = true;
    }
  }

  if(!!newContactEmail){
    if (!isEmailValid(newContactEmail)) {
      error.errorMessages.push("Please Enter A Valid Email.");
      error._formHasErrors = true;
    }
  }

  if (error._formHasErrors) {
    const { errorMessages } = error;
    return { errorMessages };
  } else {
    return false;
  }
};

export const areArtistFormFieldsValid = ({
  artistName,
  firstName,
  lastName,
  paypalEmail,
  hasAcceptTerms,
}) => {
  const error = {
    errorMessages: [],
    _formHasErrors: false,
  };

  // TODO: Validate artistName properly
  if (artistName.length < 3) {
    error.errorMessages.push("Artist name must be longer than 2 characters");
    error._formHasErrors = true;
  }

  if (!isNameValid(lastName)) {
    error.errorMessages.push("Please Enter A Valid Last Name.");
    error._formHasErrors = true;
  }

  if (!isNameValid(firstName)) {
    error.errorMessages.push("Please Enter A Valid First Name.");
    error._formHasErrors = true;
  }

  if (!isEmailValid(paypalEmail)) {
    error.errorMessages.push("Please Enter A Valid Email For Paypal Email.");
    error._formHasErrors = true;
  }

  if (!hasAcceptTerms) {
    error.errorMessages.push(
      "Please read and agree to the terms and conditions."
    );
    error._formHasErrors = true;
  }

  if (error._formHasErrors) {
    const { errorMessages } = error;
    return { errorMessages };
  } else {
    return false;
  }
};
