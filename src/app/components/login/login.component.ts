import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading = false;
  errorMessage = '';

  constructor(
    private angularAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router
  ) { }

  loginWithGoogle() {
    this.loading = true;

    this.angularAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        result.user?.getIdToken().then((idToken) => {
          this.http.post(`${environment.backendApi}/auth/google`, { idToken }).subscribe({
            next: (response: any) => {
              localStorage.setItem('token', response.customToken);
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              console.error('Erro ao autenticar no backend:', error);
            },
          });
        });
      })
      .catch((error) => {
        console.error('Erro no login com Google:', error);
      });
  }
}
