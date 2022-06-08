import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

interface InterestsDTO {
  title: string;
  img: string;
  selected: boolean;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  errors = [];
  email: string = "";
  password: string = "";
  username: string = "";
  showPassword: boolean = false;
  carouselSlide: number = 1;
  signupStep: number = 1;
  interestStep: number = 1;
  interests: InterestsDTO[] = [
    { title: 'Classical', img: '/assets/images/interests/interest-0.png', selected: false },
    { title: 'Rock', img: '/assets/images/interests/interest-1.jpg', selected: false },
    { title: 'Jazz', img: '/assets/images/interests/interest-2.jpg', selected: false },
    { title: 'Blues', img: '/assets/images/interests/interest-3.jpg', selected: false },
    { title: 'Folk', img: '/assets/images/interests/interest-4.jpg', selected: false },
    { title: 'Dance', img: '/assets/images/interests/interest-5.jpg', selected: false },
    { title: 'Popular', img: '/assets/images/interests/interest-6.jpg', selected: false },
    { title: 'Country', img: '/assets/images/interests/interest-7.jpg', selected: false },
    { title: "50's", img: '/assets/images/interests/interest-8.jpg', selected: false },
    { title: "60's", img: '/assets/images/interests/interest-9.jpg', selected: false },
    { title: "70's", img: '/assets/images/interests/interest-10.jpg', selected: false },
  ]
  activities: InterestsDTO[] = [
    { title: 'Singing', img: '/assets/images/activities/0.jpg', selected: false },
    { title: 'Dancing', img: '/assets/images/activities/1.jpg', selected: false },
    { title: 'Socializing', img: '/assets/images/activities/2.jpg', selected: false },
    { title: 'Music Listening', img: '/assets/images/activities/3.jpg', selected: false },
    { title: 'Fitness', img: '/assets/images/activities/4.jpg', selected: false },
    { title: 'Problem Solving', img: '/assets/images/activities/5.jpg', selected: false },
    { title: 'Walking', img: '/assets/images/activities/6.jpg', selected: false },
    { title: 'Meditating', img: '/assets/images/activities/7.jpg', selected: false },
    { title: 'Artwork', img: '/assets/images/activities/8.jpg', selected: false },
    { title: 'Viewing Films', img: '/assets/images/activities/9.jpg', selected: false },
    { title: 'Reading', img: '/assets/images/activities/10.jpg', selected: false },
  ];
  reminderTimes = [
    'Morning',
    'Afternoon',
    'Evening',
    'Night',
    'Specify a time',
  ];
  customTime: boolean = false;
  selectedTime!: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    setInterval(() => {
      if (this.carouselSlide === 3) this.carouselSlide = 1;
      else this.carouselSlide++;
    }, 4000);
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  checkPasswordStrength(password: string) {
    if(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{16,}$/g.test(password)) {
      return "Strong"; // atleast 16 characters with atleast 1 number, character & special character
    }
    else if(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/g.test(password)) {
      return "Good"; // atleast 10 characters
    }
    else if(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/g.test(password)) {
      return "Fair"; // atleast 6 characters
    } 
    else {
      return "Weak";
    }
  }

  updateCarouselSlide(slide: number) {
    this.carouselSlide = slide;
  }

  nextSignupStep() {
    this.signupStep++;
  }
  goToHome() {
    this.router.navigate(['/app/home']);
  }

  nextInterestStep() {
    if(this.interestStep === 3) this.goToHome();
    this.interestStep++;
  }
  selectInterest(i: number) {
    this.interests[i].selected = !this.interests[i].selected;
  }
  selectActivity(i: number) {
    this.activities[i].selected = !this.activities[i].selected;
  }
  
  selectTime(i: number) {
    if(i === 4) {
      this.toggleCustomTime();
      return;
    }
    this.selectedTime = this.reminderTimes[i];
  }
  toggleCustomTime() {
    this.customTime = !this.customTime;
  }
  getCustomTime() {
    if(/\d/.test(this.selectedTime)) {
      var [h,m] : any[] = this.selectedTime.split(":");
      [h,m] = [parseInt(h), parseInt(m)];
      return h%12+(h%12 == 0 ? 12 : 0)+":"+m + " "  + (h >= 12 ? 'PM' : 'AM');
    } else {
      return false;
    }
  }
  showNext() {
    if(this.interestStep === 1) {
      return this.interests.filter((item: any) => item.selected).length > 2;
    } else if(this.interestStep === 2) {
      return this.activities.filter((item: any) => item.selected).length > 2;
    } else {
      return this.selectedTime;
    }
  }
}
