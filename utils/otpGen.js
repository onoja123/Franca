exports.generateOTP = (length) => {
    const digits = "0123456789";
    let otp = "";
    const run = () => {
      for (let i = 1; i <= length; i++) {
        const index = Math.floor(Math.random() * digits.length);
        otp = otp + digits[index];
      }
    };
    run();
  
    if (otp.length < 4) {
      generateOTP(4);
    }
  
    return otp;
};