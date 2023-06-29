import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { CourseService } from 'src/app/service/course.service';
import { LectureService } from 'src/app/service/lecture.service';

@Component({
  selector: 'app-add-courses',
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.scss'],
})
export class AddCoursesComponent implements OnDestroy {
  selectedFile: File | null = null;
  minDate: Date;
  maxDate: Date;
  selectedDate: any;
  instructorId: any;
  hasOtherLecture: any;
  instructors: any[] = [];

  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: CourseService,
    private lectureService: LectureService,
    private router: Router
  ) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 60);
  }

  // Image selection method with event entry
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.courseForm.patchValue({ image: this.selectedFile });
  }

  // Course Form declaration and validation
  courseForm: FormGroup = this.builder.group({
    name: this.builder.control('', Validators.compose([Validators.required])),
    level: this.builder.control('', Validators.compose([Validators.required])),
    description: this.builder.control(
      '',
      Validators.compose([Validators.required])
    ),
    image: [null, Validators.required],
    lectures: this.builder.array([]),
  });

  // array of lectures to assign for a course
  get lectures(): FormArray {
    return this.courseForm.get('lectures') as FormArray;
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

  // Submit Course Form
  submitCourse() {
    if (this.courseForm.valid && this.selectedFile) {
      const courseData = new FormData();
      courseData.append('name', this.courseForm.value.name);
      courseData.append('level', this.courseForm.value.level);
      courseData.append('description', this.courseForm.value.description);
      courseData.append('image', this.courseForm.value.image);
      const lectures = this.courseForm.value.lectures.map((lecture: any) => {
        return {
          date: new Date(lecture.date).toISOString().split('T')[0], // Extract date portion and convert to ISO string
          instructorId: lecture.instructorId,
        };
      });
      courseData.append('lectures', JSON.stringify(lectures));
      this.service.addCourse(courseData).subscribe(
        (response) => {
          this.toastr.success(
            this.courseForm.value.name + ' course created successfully'
          );
          this.router.navigate(['/admin/courses']);
        },
        (error) => {
          console.error('Error submitting form:', error);
          this.toastr.error('Error submitting form', '', {
            positionClass: 'toast-bottom-right',
          });
        }
      );
    } else {
      this.toastr.warning(
        'Please make sure the values are valid and an image is selected.',
        '',
        {
          positionClass: 'toast-bottom-right',
        }
      );
    }
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
}