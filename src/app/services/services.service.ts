import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// ServicesService
@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private apiUrl = environment.backendApi;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Obter todos os serviços
  getServices(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/services`, { headers });
  }

  // Adicionar um serviço
  addService(service: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/services`, service, { headers });
  }

  // Atualizar um serviço
  updateService(service: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/services/${service.id}`, service, { headers });
  }

  // Deletar um serviço
  deleteService(serviceId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/services/${serviceId}`, { headers });
  }

  // Associar funcionário a um serviço
  associateEmployeeToService(employeeId: number, serviceId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.apiUrl}/employee-services`,
      { employee_id: employeeId, service_id: serviceId },
      { headers }
    );
  }

  getServicesForEmployee(employeeId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<any[]>(`${this.apiUrl}/services/${employeeId}`, { headers })
      .pipe(
        map((response) => {
          return response.map((service) => ({
            id: service.service_id,
            name: service.service_name,
            description: service.description,
            price: service.price,
            isGeneric: service.is_generic,
            createdAt: service.created_at,
            updatedAt: service.updated_at,
          }));
        })
      );
  }
  

  // Remover funcionário de um serviço
  removeEmployeeFromService(employeeId: number, serviceId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/employee-services/${employeeId}/${serviceId}`, { headers });
  }
}
