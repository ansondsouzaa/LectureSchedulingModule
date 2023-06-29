import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private http: HttpClient) {}
  token = sessionStorage.getItem('token'); // Get the token from sessionStorage
  auth = {
    Authorization: `Bearer ${this.token}`, // Include the token in the Authorization header
  };

  apiUrl = 'https://tame-ruby-duckling-sock.cyclic.app/api/courses/';

  // create a new course
  addCourse(courseData: any) {
    const headers = this.auth;
    return this.http.post(this.apiUrl + 'create', courseData, { headers });
  }

  uploadImage(image: any) {
    const headers = this.auth;
    return this.http.post(this.apiUrl + 'create', image, { headers });
  }

  getCourseById(id:any){
    const headers = this.auth;
    return this.http.get(this.apiUrl + id, { headers });
  }

  getAllCourses() {
    const headers = this.auth;
    return this.http.get(this.apiUrl + 'getAll', { headers });
  }

  getCoursesByInstructor(id: any) {
    const headers = this.auth;
    return this.http.get(this.apiUrl + 'findByInstructorId/' + id, {
      headers,
    });
  }
}