import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

  token = sessionStorage.getItem("token"); // Get the token from sessionStorage
  auth = {
    Authorization: "Bearer " + this.token, // Include the token in the Authorization header
  };

  authUrl = "https://tame-ruby-duckling-sock.cyclic.app/api/auth/";
  userUrl = "https://tame-ruby-duckling-sock.cyclic.app/api/users/instructors";

  loginUser(inputData: any) {
    return this.http.post(this.authUrl + "login", inputData);
  }

  addInstructor(inputData: any) {
    const headers = this.auth;
    return this.http.post(this.authUrl + "add-instructor", inputData, {
      headers,
    });
  }

  getAllInstructors() {
    const headers = this.auth;
    return this.http.get(this.userUrl, { headers });
  }

  getAllInstructor(token: any) {
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
