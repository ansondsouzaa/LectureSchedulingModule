import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class CourseService {
  constructor(private http: HttpClient) {}

  apiUrl = "https://olsm-backend.onrender.com/api/courses/";

  // create a new course
  addCourse(courseData: any, token: string) {
    const headers = {
      Authorization: "Bearer " + token,
    };
    return this.http.post(this.apiUrl + "create", courseData, { headers });
  }

  // Upload image in cloudinary
  uploadImage(fileData: any) {
    return this.http.post(
      "https://api.cloudinary.com/v1_1/dvl7ah74b/upload",
      fileData
    );
  }

  getCourseById(id: any, token: string) {
    const headers = {
      Authorization: "Bearer " + token,
    };
    return this.http.get(this.apiUrl + id, { headers });
  }

  getAllCourses(token: string) {
    const headers = {
      Authorization: "Bearer " + token,
    };
    return this.http.get(this.apiUrl + "getAll", { headers });
  }

  getCoursesByInstructor(id: any, token: string) {
    const headers = {
      Authorization: "Bearer " + token,
    };
    return this.http.get(this.apiUrl + "findByInstructorId/" + id, {
      headers,
    });
  }
}