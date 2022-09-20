import { Component } from '@angular/core';
import { phone } from 'phone';
// import countryCodes from 'country-codes-list'
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { GqlConstants } from "src/app/services/gql-constants/gql-constants.constants";
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { DailyCheckinService } from 'src/app/services/daily-checkin/daily-checkin.service';
import { JwtService } from 'src/app/services/jwt.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics/google-analytics.service';

// TODO: Decouple this Component (checkins, onboardings... etc)
@Component({
  selector: 'app-sms-otp-login',
  templateUrl: './sms-otp-login.component.html',
  styleUrls: ['./sms-otp-login.component.scss']
})
export class SmsOtpLoginComponent {
  shScreen = false;
  isMusicEnded = false;
  step = 0;
  selectedCountry = '+1 USA'; // set default to USA
  countryCode = '+1';  // set default to USA
  phoneNumber?: string;
  otpCode?: string;
  formErrorMsg?: string;
  // countryCodesList?: { [key: number]: string };

  // required to figure out which OTP API to call.
  // The Resend OTP API is called if numbers haven't changed.
  tempFullPhoneNumber?: string;
  fullPhoneNumber?: string;

  constructor(
    private graphQlService: GraphqlService,
    private router: Router,
    private userService: UserService,
    private jwtService: JwtService,
    private dailyCheckinService: DailyCheckinService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    // this.countryCodesList = countryCodes.customList('countryCallingCode', '+{countryCallingCode} {countryNameEn}');
    // console.log('myCountryCodesObject:', this.countryCodesList);
    // fetch user's country.
    // this.userService.fetchCountry().subscribe(res => {
    //   this.userService.fetchCountryPhone(res.country)
    //     .then(fetchCountryPhoneResp => {
    //       this.countryCode = `+${fetchCountryPhoneResp.phone}`
    //       this.selectedCountry = `${this.countryCode} ${fetchCountryPhoneResp.name}`
    //       this.step++;
    //     })
    // })
  }

  ngOnInit(): void { }

  async submit(event: any) {
    // call API to send an OTP
    if (this.step === 0) {
      this.countryCode = event.target.countryCode.value;
      if (this.countryCode.slice(0, 1) !== '+') {
        this.countryCode = `+${this.countryCode}`;
      }
      this.phoneNumber = event.target.phoneNumber.value;
      console.log('submit:countryCode:', this.countryCode);
      console.log('submit:phoneNumber:', this.phoneNumber);

      let phoneObj = phone(`${this.countryCode}${this.phoneNumber}`);
      console.log(phoneObj);

      if (!phoneObj.isValid) {
        this.showError('Phone number is not valid');
        return;
      }

      this.fullPhoneNumber = phoneObj.phoneNumber;

      // call the Resend OTP API, since phone number did not change.
      if (this.tempFullPhoneNumber === this.fullPhoneNumber) {
        console.log('resend OTP API called');
        const resp = await this.graphQlService.gqlRequest(GqlConstants.RESEND_LOGIN_OTP, {
          phoneCountryCode: this.countryCode,
          phoneNumber: this.phoneNumber
        }, false);
        if (!resp || !resp.resendLoginOtp || !resp.resendLoginOtp.data.message) {
          this.showError('Something went wrong while sending OTP.')
          return;
        }
      }
      // call Request Login OTP API, since the phone number changed.
      else {
        const resp = await this.graphQlService.gqlRequest(GqlConstants.REQUEST_LOGIN_OTP, {
          phoneCountryCode: this.countryCode,
          phoneNumber: this.phoneNumber
        }, false);
        if (!resp || !resp.requestLoginOtp || !resp.requestLoginOtp.data.message) {
          this.showError('Something went wrong while sending OTP.')
          return;
        }
      }

      // increment step
      this.formErrorMsg = '';
      this.step++;
    }

    // call API to validate the code
    else if (this.step === 1) {
      this.otpCode = event.target.otpCode.value;
      console.log('submit:otpCode:', this.otpCode);

      // you should get back JWT in success response.
      const resp = await this.graphQlService.gqlRequest(GqlConstants.VERIFY_LOGIN_OTP, {
        phoneCountryCode: this.countryCode,
        phoneNumber: this.phoneNumber,
        otp: parseInt(this.otpCode!)
      }, false);

      if (!resp || !resp.verifyLoginOtp || !resp.verifyLoginOtp.data.token) {
        this.showError('That is not the code.')
        return;
      }

      // set user as well
      this.jwtService.setToken(resp.verifyLoginOtp.data.token);

      const accessTokenData = this.decodeJwt(resp.verifyLoginOtp.data.token);
      let userId;
      if (accessTokenData && accessTokenData["https://hasura.io/jwt/claims"]) {
        userId = accessTokenData["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
      }
      this.userService.set({
        id: userId,
      });
      this.googleAnalyticsService.setUserId(userId);
      console.log('user set successfully');
      // emit signup event
      this.googleAnalyticsService.sendEvent('login');

      this.shScreen = true;
      await this.waitForTimeout(6500);
      const isCheckedInToday = await this.isCheckedInToday();
      if (!isCheckedInToday) {
        this.router.navigate(["app", "checkin"]);
        return;
      }

      const step = await this.userService.isOnboarded();
      if (step == -1) {
        this.router.navigate(["app", "home"]);
      } else {
        this.router.navigate(["app", "signup", step]);
      }
    }
  }

  resetForm() {
    this.tempFullPhoneNumber = this.fullPhoneNumber;

    this.step = 0;
    this.phoneNumber = '';
    this.fullPhoneNumber = '';
    this.otpCode = '';
    this.formErrorMsg = '';
  }

  showError(message: string, timeout: number = 5000) {
    this.formErrorMsg = message;
    setTimeout(() => {
      this.formErrorMsg = '';
    }, timeout);
  }

  async waitForTimeout(timeout: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({});
      }, timeout);
    });
  }

  async isCheckedInToday() {
    const res = await this.dailyCheckinService.getLastCheckin();
    if (!res.checkin[0]) return false;
    const checkedInAt = new Date(res.checkin[0].createdAt);
    const today = new Date();
    return checkedInAt.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0);
  }

  decodeJwt(token: string | undefined) {
    if (token) {
      const parts = token.split(".");
      if (parts.length === 3) {
        return JSON.parse(atob(parts[1]));
      }
    }
  }
}
