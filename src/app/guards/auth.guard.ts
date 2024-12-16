import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const targetRoute = route.routeConfig?.path; // Captura a rota alvo


    return this.authService.verifyToken().pipe(
      switchMap(() => {
        return this.authService.getPaymentStatus();
      }),
      map((response) => {
        const isPaymentValid = response.isPaymentValid; // Extrai a propriedade corretamente

        // Pagamento inválido e tentando acessar o dashboard
        if (!isPaymentValid && targetRoute === 'dashboard') {
          this.router.navigate(['/pagamento']);
          return false;
        }

        // Pagamento válido e tentando acessar a rota de pagamento
        if (isPaymentValid && targetRoute === 'pagamento') {
          this.router.navigate(['/dashboard']);
          return false;
        }

        return true; // Permite acesso à rota solicitada
      }),
      catchError((error) => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
