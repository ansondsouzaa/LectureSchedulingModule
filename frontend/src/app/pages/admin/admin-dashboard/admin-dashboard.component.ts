import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ToastrService } from 'ngx-toastr';

interface Instructor {
  name: String;
  _id: String;
  email: String;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  role: any;
  admin = 'admin';
  progress = true;

  constructor(
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.role = sessionStorage.getItem('role');
    });
    this.getInstructors();
    if(this.instructors.length > 0){
      this.progress = false;
    }
  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  instructors: Instructor[] = [];
  token = sessionStorage.getItem('token');
  getInstructors() {
    this.auth.getAllInstructor(this.token).subscribe(
      (res: any) => {
        this.instructors = res.instructors;
      },
      (error) => {
        const errorMessage = error.message;
        this.toastr.error("Some error occured couldn't fetch data", "", {
          positionClass: "toast-bottom-right",
        });
        return errorMessage;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const value: any = filterValue.trim().toLowerCase();
    this.instructors.filter = value;
  }

  ngOnDestroy() {
    this.getInstructors();
  }
}
