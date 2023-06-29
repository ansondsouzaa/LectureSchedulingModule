import { Component } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

interface Courses {
  _id: string;
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
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent {
  panelOpenState = false;
  constructor(
    private service: CourseService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllCourses();
  }

  courses: Courses[] = [];
  getAllCourses() {
    this.service.getAllCourses().subscribe(
      (res: any) => {
        this.courses = res.courses;
      },
      (error) => {
        const errorMessage = error.message;
        this.toastr.error("Some error occured couldn't fetch data", '', {
          positionClass: 'toast-bottom-right',
        });
        return errorMessage();
      }
    );
  }

  displayedColumns: string[] = ['Instructor', 'date'];

  addLectures(id: any) {
    this.router.navigate(['/admin/edit-course', id]);
  }
}
