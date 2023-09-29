import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenNames = ['voldemort', 'tom marvolo riddle', 'lord voldemort'];
  forbiddenEmails = ['test@test.com'];

  ngOnInit() {
    this.signupForm = new FormGroup({
      userData: new FormGroup({
        username: new FormControl(null, [
          Validators.required,
          this.forbidNames.bind(this),
        ]),
        email: new FormControl(
          null,
          [Validators.required, Validators.email],
          [this.forbidEmails.bind(this)]
        ),
      }),
      gender: new FormControl('male'),
      hobbies: new FormArray([]),
    });
  }

  onSubmit() {
    console.log('form:', this.signupForm);
    this.signupForm.reset();
  }

  onAddHobby() {
    const hobby = new FormControl(null, Validators.required);
    this.hobbies.push(hobby);
  }

  forbidNames(control: FormControl): ValidationErrors {
    return this.forbiddenNames.includes(control?.value?.toLowerCase())
      ? { forbidNames: true }
      : null;
  }

  forbidEmails(control: FormControl): Promise<ValidationErrors> {
    const promise = new Promise((res, rej) => {
      setTimeout(() => {
        if (this.forbiddenEmails.includes(control?.value)) {
          res({ forbidEmails: true });
        } else {
          res(null);
        }
      }, 1500);
    });

    return promise;
  }

  get hobbies(): FormArray {
    return this.signupForm.get('hobbies') as FormArray;
  }

  get username(): AbstractControl {
    return this.signupForm.get('userData.username');
  }

  get email(): AbstractControl {
    return this.signupForm.get('userData.email');
  }
}
