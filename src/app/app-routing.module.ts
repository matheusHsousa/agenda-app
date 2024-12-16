import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/client-view/dashboard/dashboard.component';
import { ClientViewComponent } from './components/client-view/client-view.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component'; // Importe o componente
import { AuthGuard } from './guards/auth.guard';
import { PaymentComponent } from './components/payment/payment.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'client', component: ClientViewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'pagamento', component: PaymentComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
