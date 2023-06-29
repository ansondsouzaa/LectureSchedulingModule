import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LectureService {
  constructor(private http: HttpClient) {}
  token = sessionStorage.getItem('token'); // Get the token from sessionStorage
  auth = {
    Authorization: `Bearer ${this.token}`, // Include the token in the Authorization header
  };

  apiUrl = 'http://localhost:1000/api/lectures/';

  checkLectures(instructorId: string, date: string): Observable<any> {
    const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    const headers = this.auth;
    return this.http.get(
      `${this.apiUrl}check/?instructorId=${instructorId}&date=${formattedDate}`,
      { headers }
    );
  }

  addNewLectures(courseData: any) {
    const headers = this.auth;
    console.log(courseData);
    return this.http.post(this.apiUrl + 'new', courseData, { headers });
  }
}
