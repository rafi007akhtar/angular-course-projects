import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  projectForm: FormGroup;
  forbiddenProjectNames = ["Test"];

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      projectName: new FormControl(
        "",
        [
          Validators.required,
          // this.forbidProjectNames.bind(this), // uncomment for sync validator
        ],
        [this.forbidProjectNamesAsync.bind(this)] // uncomment for async validator
      ),
      mail: new FormControl("", [Validators.required, Validators.email]),
      state: new FormControl(""),
    });
  }

  submitHandler() {
    console.log("form:", this.projectForm);
  }

  forbidProjectNames(control: FormControl): ValidationErrors {
    if (this.forbiddenProjectNames.includes(control?.value)) {
      return { hasForbiddenName: true };
    }
    return null;
  }

  forbidProjectNamesAsync(control: FormControl): Promise<ValidationErrors> {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (this.forbiddenProjectNames.includes(control?.value)) {
          return res({ hasForbiddenName: true });
        } else {
          return res(null);
        }
      }, 1500);
    });
  }
}
