import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  getErrorMessage: any;
  hide = true;

  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router
  ) {}

  instructorLoginForm = this.builder.group({
    email: this.builder.control(
      '',
      Validators.compose([Validators.required, Validators.email])
    ),
    password: this.builder.control(
      '',
      Validators.compose([Validators.required])
    ),
  });

  adminLoginForm = this.builder.group({
    email: this.builder.control(
      '',
      Validators.compose([Validators.required, Validators.email])
    ),
    password: this.builder.control(
      '',
      Validators.compose([Validators.required])
    ),
  });

  proceedInstructorLogin() {
    if (this.instructorLoginForm.valid) {
      this.auth.loginUser(this.instructorLoginForm.value).subscribe(
        (res: any) => {
          // Extract the values from the response and store in localStorage
          if (res.userObj.role === 'instructor') {
            const token = res.token;
            sessionStorage.setItem('token', token);
            const role = res.userObj.role;
            sessionStorage.setItem('role', role);
            const name = res.userObj.name;
            sessionStorage.setItem('name', name);
            const id = res.userObj._id;
            sessionStorage.setItem('id', id);
            this.router.navigate(['/instructor/dashboard']);
            this.toastr.success(name + ' login successful as ' + role);
          } else {
            this.toastr.warning('Email or password do not match our records.');
          }
        },
        (error) => {
          const errorMessage = error.message;
          this.toastr.error(
            "Some error occured couldn't login",
            'Please try again later',
            {
              positionClass: 'toast-bottom-right',
            }
          );
          return errorMessage();
        }
      );
    } else {
      this.toastr.warning('Please fill the fields with valid input.', '', {
        positionClass: 'toast-bottom-right',
      });
    }
  }

  proceedAdminLogin() {
    if (this.adminLoginForm.valid) {
      this.auth.loginUser(this.adminLoginForm.value).subscribe(
        (res: any) => {
          // Extract the values from the response and store in localStorage
          if (res.userObj.role === 'admin') {
            const token = res.token;
            sessionStorage.setItem('token', token);
            const role = res.userObj.role;
            sessionStorage.setItem('role', role);
            const name = res.userObj.name;
            sessionStorage.setItem('name', name);
            this.router.navigate(['/admin/dashboard']);
            this.toastr.success(name + ' login successful as ' + role);
          } else {
            this.toastr.warning('Email or password do not match our records.');
          }
        },
        (error) => {
          const errorMessage = error.message;
          this.toastr.error(
            "Some error occured couldn't login",
            'Please try again later',
            {
              positionClass: 'toast-bottom-right',
            }
          );
          return errorMessage();
        }
      );
    } else {
      this.toastr.warning('Please fill the fields with valid input', '', {
        positionClass: 'toast-bottom-right',
      });
    }
  }
}
