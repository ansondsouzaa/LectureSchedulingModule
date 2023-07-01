import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';
import { ToastrService } from 'ngx-toastr';

interface Courses {
  name: string;
  level: string;
  description: string;
  image: string;
  lectures: Lectures[];
}

interface Lectures {
  date: string;
  instructor: {
    instructor_id: string;
    name: string;
  };
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  panelOpenState = true;
  name = sessionStorage.getItem("name");
  id: any = sessionStorage.getItem("id");
  token: any = sessionStorage.getItem("token");

  constructor(private service: CourseService, private toastr: ToastrService) {}

  ngOnInit() {
    this.panelOpenState = true;
    this.getCoursesByInstructor();
  }

  // instead of Courses[] can even use any[] but used Courses[] for strict type checking
  courses: Courses[] = [];
  getCoursesByInstructor() {
    this.service.getCoursesByInstructor(this.id, this.token).subscribe(
      (res: any) => {
        this.courses = res;
      },
      (error) => {
        const errorMessage = error.message;
        this.toastr.error("Some error occured couldn't fetch data", "", {
          positionClass: "toast-bottom-right",
        });
        return errorMessage();
      }
    );
  }

  displayedColumns: string[] = ["Instructor", "date"];
}
