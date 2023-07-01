import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

  authUrl = "https://olsm-backend.onrender.com/api/auth/";
  userUrl = "https://olsm-backend.onrender.com/api/users/instructors";

  loginUser(inputData: any) {
    return this.http.post(this.authUrl + "login", inputData);
  }

  addInstructor(inputData: any, token: string) {
    const headers = {
      Authorization: "Bearer " + token,
    };
    return this.http.post(this.authUrl + "add-instructor", inputData, {
      headers,
    });
  }

  getAllInstructor(token: string) {
    const headers = {
      Authorization: "Bearer " + token,
    };
    return this.http.get(this.userUrl, { headers });
  }

  isLoggedIn() {
    return sessionStorage.getItem("token") != null;
  }

  getUserRole() {
    return sessionStorage.getItem("role") != null
      ? sessionStorage.getItem("role")?.toString()
      : "";
  }
}
