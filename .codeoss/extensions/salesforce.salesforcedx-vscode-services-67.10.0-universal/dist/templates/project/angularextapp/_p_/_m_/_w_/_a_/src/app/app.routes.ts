import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found';
import { authGuard } from "./features/authentication/auth/auth.guard";
import { LoginPageComponent } from "./pages/login/login-page";
import { RegisterPageComponent } from "./pages/register/register-page";
import { ForgotPasswordPageComponent } from "./pages/forgot-password/forgot-password-page";
import { ResetPasswordPageComponent } from "./pages/reset-password/reset-password-page";
import { ProfilePageComponent } from "./pages/profile/profile-page";
import { ChangePasswordPageComponent } from "./pages/change-password/change-password-page";
import { AppLayoutComponent } from "./components/layout/app-layout/app-layout";
import { HomePageComponent } from "./pages/home/home-page";
import { AccountSearchPageComponent } from "./pages/account-search/account-search-page";
import { AccountDetailPageComponent } from "./pages/account-detail/account-detail-page";

export const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      {
        path: "",
        component: HomePageComponent,
        data: { showInNavigation: true, label: "Home" }
      },
      {
        path: "login",
        component: LoginPageComponent,
        title: "Login | MyApp",
        data: { showInNavigation: false, label: "Login" }
      },
      {
        path: "register",
        component: RegisterPageComponent,
        title: "Create Account | MyApp",
        data: { showInNavigation: false }
      },
      {
        path: "forgot-password",
        component: ForgotPasswordPageComponent,
        title: "Recover Password | MyApp",
        data: { showInNavigation: false }
      },
      {
        path: "reset-password",
        component: ResetPasswordPageComponent,
        title: "Reset Password | MyApp",
        data: { showInNavigation: false }
      },
      {
        path: "profile",
        component: ProfilePageComponent,
        canActivate: [authGuard],
        title: "My Profile | MyApp",
        data: { showInNavigation: false, label: "Profile" }
      },
      {
        path: "change-password",
        component: ChangePasswordPageComponent,
        canActivate: [authGuard],
        title: "Change Password | MyApp",
        data: { showInNavigation: false }
      },
      {
        path: "accounts/:recordId",
        component: AccountDetailPageComponent
      },
      {
        path: "accounts",
        component: AccountSearchPageComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];
