import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { CoursesComponent } from "./pages/courses/courses.component";
import { EditCoursesComponent } from "./pages/admin/edit-courses/edit-courses.component";
import { AddCoursesComponent } from "./pages/admin/add-courses/add-courses.component";
import { AuthGuard } from "./guard/auth.guard";
import { AdminDashboardComponent } from "./pages/admin/admin-dashboard/admin-dashboard.component";
import { AddInstructorComponent } from "./pages/admin/add-instructor/add-instructor.component";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "instructor",
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: "admin",
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        component: AdminDashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "courses",
        component: CoursesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "add-course",
        component: AddCoursesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "edit-course/:id",
        component: EditCoursesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "add-instructor",
        component: AddInstructorComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  { path: "**", redirectTo: "login", pathMatch: "full" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      initialNavigation: "enabledBlocking",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
