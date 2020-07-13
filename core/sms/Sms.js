var msg91 = require("msg91");
var SendOtp = require("sendotp");

module.exports = class Sms {
  constructor(kSMSApiKey, kSMSSenderId, kAndroidKeyStoreHash) {

    this.kSMSApiKey = kSMSApiKey;
    this.kSMSSenderId = kSMSSenderId;
    this.kAndroidKeyStoreHash = kAndroidKeyStoreHash


    this.smsSender = msg91(kSMSApiKey, kSMSSenderId, 4); //route 4 is transactional sms
    let encodedHash = encodeURIComponent(this.kAndroidKeyStoreHash)

    this.otpSender = new SendOtp(
      kSMSApiKey,
      `<#> Welcome to the Expense Tracker {{otp}} is your OTP. ${encodedHash}`
    );
    this.otpSender.setOtpExpiry("15"); //15 minutes

  }

  async sendSMS(to, body) {

    if (Array.isArray(to)) {
      to = to.map((ph) => `+91${ph}`);
    } else {
      to = `+91${to}`
    }
     await this.smsSender.send(to,body, function (err, response) {
        if (err) return err
        return response
    });
  }


  async sendOTP(to, otp) {
    to = `+91${to}`
    return new Promise((resolve, reject) => {
      this.otpSender.send(to, this.kSMSSenderId, otp, function (err, data, response) {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }

  // async verifyOTP(to, otp) {

  //   to = `+91${to}`
  //   return new Promise((resolve, reject) => {
  //     this.otpSender.verify(to, otp, function (err, data, response) {
  //       if (err) return reject(err);
  //       if (data.type == "success") {
  //         resolve(data);
  //       } else {
  //         reject(Error("Invalid OTP"));
  //       }
  //     });
  //   });
  // }

  static create() {
    let smsService = new Sms(process.env.kSMSApiKey, process.env.kSMSSenderId, process.env.kAndroidKeyStoreHash)
    return smsService
  }

};
