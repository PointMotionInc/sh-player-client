import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginPageComponent } from "./pages/auth/login-page/login-page.component";
import { HomeComponent } from "./pages/app/home/home.component";
import { SessionComponent } from "./pages/app/session/session.component";

const routes: Routes = [
  { path: "", component: LoginPageComponent },
  { path: "app/home", component: HomeComponent },
  { path: "app/session/:id", component: SessionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
