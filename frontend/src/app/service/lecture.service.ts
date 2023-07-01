import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class LectureService {
  constructor(private http: HttpClient) {}

  apiUrl = "https://olsm-backend.onrender.com/api/lectures/";

  checkLectures(instructorId: string, date: string, token: string): Observable<any> {
    const formattedDate = formatDate(date, "yyyy-MM-dd", "en-US");
    const headers = {
      Authorization: "Bearer " + token,
    };
    return this.http.get(
      `${this.apiUrl}check/?instructorId=${instructorId}&date=${formattedDate}`,
      { headers }
    );
  }

  addNewLectures(lectureData: any, token: string) {
    const headers = {
      Authorization: "Bearer " + token,
    };
    console.log(lectureData);
    return this.http.post(this.apiUrl + "new", lectureData, { headers });
  }
}
