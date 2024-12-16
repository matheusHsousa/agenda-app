import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './components/client-view/dashboard/dashboard.component';
import { HomeDashComponent } from './components-dasshboard/home-dash/home-dash.component';
import { ScheduleDashComponent } from './components-dasshboard/schedule-dash/schedule-dash.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { ConfigurationComponent } from './components-dasshboard/configuration/configuration.component';
import { EmployeesServicesComponent } from './components-dasshboard/employees-services/employees-services.component';
import { CompanyColorsComponent } from './components-dasshboard/components-configuration/company-colors/company-colors.component';
import { ScheduleConfigComponent } from './components-dasshboard/components-configuration/schedule-config/schedule-config.component';
import { HolidaysComponent } from './components-dasshboard/components-configuration/holidays/holidays.component';
import { DayOffComponent } from './components-dasshboard/components-configuration/day-off/day-off.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadersInterceptor } from './interceptor/loaders.interceptor';
import { LoaderComponent } from './loader/loader.component';
import { PaymentComponent } from './components/payment/payment.component';
import { BootstrapSnackbarComponent } from './shared/bootstrap-snackbar/bootstrap-snackbar.component';



registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent, LandingPageComponent, DashboardComponent, HomeDashComponent, ScheduleDashComponent, ModalComponent, ConfigurationComponent, EmployeesServicesComponent, CompanyColorsComponent, ScheduleConfigComponent, HolidaysComponent, DayOffComponent, ModalComponent, LoaderComponent, PaymentComponent, BootstrapSnackbarComponent],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FontAwesomeModule,
    MatDialogModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule, 
    MatButtonToggleModule,
    MatTooltipModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // Define o idioma padrão como português do Brasil
    { provide: HTTP_INTERCEPTORS, useClass: LoadersInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
