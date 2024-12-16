import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Certifique-se de que o caminho para o arquivo environment está correto
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  // Login com Google enviando o ID Token para o backend
  loginWithGoogle(idToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/google`, { idToken });
  }

  // Verifica o token JWT no backend
  verifyToken(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/auth/protected`, { headers });
  }

  // Faz logout removendo o token JWT do localStorage
  logout(): void {
    localStorage.removeItem('token');
  }

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtem dados da rota protegida
  getProtectedData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/auth/protected`, { headers });
  }

  getPaymentStatus(): Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/auth/payment-status`, {headers})
  }

  // Obter todos os agendamentos
  getSchedules(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/schedules`, { headers });
  }

  // Obter agendamentos do mês
  getMonthlySchedules(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/schedules/monthly`, { headers });
  }

  // Obter agendamentos do dia específico
  getDailySchedules(date: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/schedules/daily/${date}`, { headers });
  }

  // Criar agendamento
  createSchedule(schedule: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/schedules`, schedule, { headers });
  }

  // Atualizar agendamento
  updateSchedule(id: string, schedule: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/schedules/${id}`, schedule, { headers });
  }

  // Excluir agendamento
  deleteSchedule(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/schedules/${id}`, { headers });
  }

  getProfessionals(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<any[]>(`${this.apiUrl}/employees`, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro:', error);
    return throwError(() => error.error || 'Erro no servidor. Tente novamente mais tarde.');
  }

  getAllSchedules(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/schedules`, { headers });
  }
}
