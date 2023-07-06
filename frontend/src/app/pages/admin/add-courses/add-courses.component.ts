import { Component, OnDestroy } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/service/auth.service";
import { CourseService } from "src/app/service/course.service";
import { LectureService } from "src/app/service/lecture.service";
import * as moment from "moment";

@Component({
  selector: "app-add-courses",
  templateUrl: "./add-courses.component.html",
  styleUrls: ["./add-courses.component.scss"],
})
export class AddCoursesComponent implements OnDestroy {
  selectedFile: File | null = null;
  minDate: Date;
  maxDate: Date;
  selectedDate: any;
  instructorId: any;
  hasOtherLecture: any;
  instructors: any[] = [];
  previewUrl: any;
  token: any = sessionStorage.getItem("token");

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

  ngOnInit() {
    this.getInstructors();
  }

  // Image selection method with event entry
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.courseForm.patchValue({ image: this.selectedFile });
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.previewUrl = null;
    }
  }

  // Course Form declaration and validation
  courseForm: FormGroup = this.builder.group({
    name: this.builder.control("", Validators.compose([Validators.required])),
    level: this.builder.control("", Validators.compose([Validators.required])),
    description: this.builder.control(
      "",
      Validators.compose([Validators.required])
    ),
    image: [null, Validators.required],
    lectures: this.builder.array([]),
  });

  // array of lectures to assign for a course
  get lectures(): FormArray {
    return this.courseForm.get("lectures") as FormArray;
  }

  // lecture formgroup
  addLecture(): void {
    const lectureFormGroup: FormGroup = this.builder.group({
      date: this.builder.control("", Validators.required),
      instructorId: this.builder.control("", Validators.required),
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
      const lectures = this.courseForm.value.lectures.map((lecture: any) => {
        const date = moment(lecture.date).format("YYYY-MM-DD");
        return {
          date: date,
          instructorId: lecture.instructorId,
        };
      });
      // Upload image to Cloudinary
      const fileData = new FormData();
      fileData.append("file", this.selectedFile);
      fileData.append("upload_preset", "fhfzcahy");

      this.service.uploadImage(fileData).subscribe(
        (response: any) => {
          const imageUrl = response["url"]; // To extract the uploaded image URL from the Cloudinary API response
          // Create course data
          const courseData = {
            name: this.courseForm.value.name,
            level: this.courseForm.value.level,
            description: this.courseForm.value.description,
            image: imageUrl, // Store the Cloudinary image URL as a string
            lectures: lectures,
          };

          this.service.addCourse(courseData, this.token).subscribe(
            (response) => {
              this.toastr.success(
                this.courseForm.value.name + " course created successfully"
              );
              this.router.navigate(["/admin/courses"]);
            },
            (error) => {
              console.error("Error submitting form:", error);
              this.toastr.error("Error submitting form", "", {
                positionClass: "toast-bottom-right",
              });
            }
          );
        },
        (error) => {
          console.error("Error uploading image:", error);
          this.toastr.error("Error uploading image", "", {
            positionClass: "toast-bottom-right",
          });
        }
      );
    } else {
      this.toastr.warning(
        "Please make sure the values are valid and an image is selected.",
        "",
        {
          positionClass: "toast-bottom-right",
        }
      );
    }
  }

  // get all instructors
  getInstructors() {
    this.auth.getAllInstructor(this.token).subscribe(
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
        .checkLectures(this.instructorId, this.selectedDate, this.token)
        .subscribe(
          (response: any) => {
            if (response.hasLecture) {
              this.toastr.warning(
                "Instructor is not available for the selected date",
                "Try a different date",
                {
                  positionClass: "toast-bottom-right",
                }
              );
            }
            this.hasOtherLecture = response.hasLecture;
          },
          (error: any) => {
            this.toastr.error("Error checking instructor lecture", "", {
              positionClass: "toast-bottom-right",
            });
            // console.error('Error checking instructor lecture:', error);
          }
        );
    }
  }
}
