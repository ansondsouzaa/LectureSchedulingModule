import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  role: any;
  admin = 'admin';

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.role = sessionStorage.getItem('role');
    });
  }

  constructor(private router: Router, private toastr: ToastrService,) {}

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('id');
    this.toastr.success('Logged out successfully')
    this.router.navigate(['login']);
  }
}
