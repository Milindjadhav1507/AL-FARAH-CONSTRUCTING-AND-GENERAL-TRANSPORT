import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UiReferenceComponent } from './pages/ui-reference/ui-reference.component';
import { FleetManageComponent } from './pages/fleet-manage/fleet-manage.component';
import { CampManageComponent } from './pages/camp-manage/camp-manage.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { UserManageComponent } from './pages/user-manage/user-manage.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'ui-reference', component: UiReferenceComponent },
      { path: 'fleet-management', component: FleetManageComponent },
      { path: 'camps-management', component: CampManageComponent },
      { path: 'user-management', component: UserManageComponent },
      { path: 'reports', component: ReportsComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
