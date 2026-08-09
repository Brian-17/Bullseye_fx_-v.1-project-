import { Routes } from '@angular/router';
import { AppLayoutComponent } from './components/layout/app-layout/app-layout';
import { NotFoundComponent } from './pages/not-found/not-found';
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
