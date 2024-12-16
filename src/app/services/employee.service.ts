import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ApiResponse } from "../interfaces/response.interface";



// EmployeesService
@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private apiUrl = environment.backendApi;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getEmployees(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/employees`, { headers });
  }

  addEmployee(employee: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/employees`, employee, { headers });
  }

  updateEmployee(employee: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/employees/${employee.id}`, employee, { headers });
  }

  deleteEmployee(employeeId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/employees/${employeeId}`, { headers });
  }

  getEmployeeService(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/employees/employees-services`, { headers });
  }
  
  createAppointment(appointment: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/appointments`, appointment, { headers });
  }
  
  getEmployeeSchedule(employeeId: number, date: string): Observable<ApiResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse>(`${this.apiUrl}/employees/available-slots?employee_id=${employeeId}&date=${date}`, { headers });
  }
}
