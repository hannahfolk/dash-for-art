import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Captcha = (props) => {
  const { handleCaptchaChange } = props;

  return (
    <ReCAPTCHA
      sitekey="6Le94tEZAAAAABZm8j69sD1XcvRsOjY-9GrnWsgu"
      onChange={handleCaptchaChange}
    />
  );
};

export default Captcha;
