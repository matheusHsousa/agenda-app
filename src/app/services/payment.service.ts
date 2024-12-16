import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.backendApi;

  constructor(private http: HttpClient) { }

  // Gera cabeçalhos com o token JWT
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado no localStorage.');
      throw new Error('Token não encontrado.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  createSubscription(paymentData: {
    amount: number; 
    description: string; 
    paymentMethod: string; 
    payer?: any; 
  }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/auth/create-subscription`,  paymentData, { headers });
  }  

  createPayment(paymentData: { 
    amount: number; 
    description: string; 
    paymentMethod: string; 
    payer?: any; // Dados opcionais para cartão
  }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/auth/create-payment`, paymentData, { headers });
  }
    

  getPaymentMethods(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/auth/payment-methods`, { headers });
  }
  
  getPlans(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/auth/plans`, { headers });
  }

  validateCardBrand(bin: string): Observable<any> {
    if (bin.length < 6) {
      throw new Error('O BIN deve conter pelo menos 6 dígitos.');
    }
    const headers = this.getAuthHeaders(); 
    return this.http.post(`${this.apiUrl}/auth/validate-card-brand`, { bin }, { headers });
  }   
  
  getPixPaymentStatus(pixId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/check-pix-status/${pixId}`);
  }
  
}
