import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: "app-add-instructor",
  templateUrl: "./add-instructor.component.html",
  styleUrls: ["./add-instructor.component.scss"],
})
export class AddInstructorComponent {
  getErrorMessage: any;
  hide = true;
  token: any = sessionStorage.getItem("token");

  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router
  ) {}

  addInstructorForm = this.builder.group({
    name: this.builder.control("", Validators.compose([Validators.required])),
    email: this.builder.control(
      "",
      Validators.compose([Validators.required, Validators.email])
    ),
    password: this.builder.control(
      "",
      Validators.compose([Validators.required])
    ),
  });

  addInstructor() {
    if (this.addInstructorForm.valid) {
      this.auth
        .addInstructor(this.addInstructorForm.value, this.token)
        .subscribe(
          (res: any) => {
            this.toastr.success("New instructor added successfully");
            this.router.navigate(["/admin/dashboard"]);
          },
          (error) => {
            const errorMessage = error.message;
            this.toastr.warning(
              "Some error occured please try again later.",
              "",
              {
                positionClass: "toast-bottom-right",
              }
            );
            return errorMessage();
          }
        );
    } else {
      this.toastr.warning("Please make sure the values are valid.", "", {
        positionClass: "toast-bottom-right",
      });
    }
  }
}
