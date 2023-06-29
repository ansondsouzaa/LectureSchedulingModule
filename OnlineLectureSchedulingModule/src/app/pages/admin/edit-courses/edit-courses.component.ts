import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { CourseService } from 'src/app/service/course.service';
import { LectureService } from 'src/app/service/lecture.service';

@Component({
  selector: 'app-edit-courses',
  templateUrl: './edit-courses.component.html',
  styleUrls: ['./edit-courses.component.scss'],
})
export class EditCoursesComponent {
  selectedFile: File | null = null;
  minDate: Date;
  maxDate: Date;
  selectedDate: any;
  instructorId: any;
  hasOtherLecture: any;
  instructors: any[] = [];
  course: any;
  courseId: any;
  lectureList: any[] = [];
  displayedColumns: string[] = ['Instructor', 'date'];

  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: CourseService,
    private lectureService: LectureService,
    private route: ActivatedRoute
  ) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 60);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // get course by id
      this.courseId = params['id'];
      this.getCourseById();
    });
  }

  // get course by id
  getCourseById() {
    this.service.getCourseById(this.courseId).subscribe(
      (response: any) => {
        this.course = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  // get all instructors
  getInstructors() {
    this.auth.getAllInstructors().subscribe(
      (res: any) => {
        this.instructors = res.instructors;
      },
      (error) => {
        const errorMessage = error.message;
        return errorMessage();
      }
    );
  }

  ngOnDestroy() {
    this.getInstructors();
    this.getCourseById();
  }

  // date change checker
  onDateChange(event: any) {
    this.selectedDate = event.value;
    this.checkInstructorLecture();
  }

  // instructor select checker
  onInstructorChange(event: any) {
    this.instructorId = event.value;
    this.checkInstructorLecture();
  }

  // check if instructor is available on a date
  checkInstructorLecture() {
    if (this.selectedDate && this.instructorId) {
      this.lectureService
        .checkLectures(this.instructorId, this.selectedDate)
        .subscribe(
          (response: any) => {
            if (response.hasLecture) {
              this.toastr.warning(
                'Instructor is not available for the selected date',
                'Try a different date',
                {
                  positionClass: 'toast-bottom-right',
                }
              );
            }
            this.hasOtherLecture = response.hasLecture;
          },
          (error: any) => {
            this.toastr.error('Error checking instructor lecture', '', {
              positionClass: 'toast-bottom-right',
            });
            // console.error('Error checking instructor lecture:', error);
          }
        );
    }
  }

  // Form with lectures array
  form: FormGroup = this.builder.group({
    lectures: this.builder.array([]),
  });

  // array of lectures to assign for a course
  get lectures(): FormArray {
    return this.form.get('lectures') as FormArray;
  }

  // lecture formgroup
  addLecture(): void {
    this.getInstructors();
    const lectureFormGroup: FormGroup = this.builder.group({
      date: this.builder.control('', Validators.required),
      instructorId: this.builder.control('', Validators.required),
    });
    this.lectures.push(lectureFormGroup);
  }

  // Remove a lecture field
  removeLecture(index: number): void {
    this.lectures.removeAt(index);
  }

  // add lectures to course method
  updateCourse() {
    if (this.form.value.lectures.length != 0) {
      const lectureData = new FormData();
      lectureData.append('courseId', this.courseId);
      const lectures = this.form.value.lectures.map((lecture: any) => {
        return {
          date: new Date(lecture.date).toISOString().split('T')[0], // Extract date portion and convert to ISO string
          instructorId: lecture.instructorId,
        };
      });
      lectureData.append('lectures', JSON.stringify(lectures));
      this.lectureService.addNewLectures(lectureData).subscribe(
        (response) => {
          this.toastr.success('Lectures added successfully');
          this.getCourseById();
        },
        (error) => {
          console.error('Error submitting form:', error);
          this.toastr.error('Error submitting form', '', {
            positionClass: 'toast-bottom-right',
          });
        }
      );
    } else {
      this.toastr.warning('Add a lecture before clicking on submit.', '', {
        positionClass: 'toast-bottom-right',
      });
    }
  }
}
