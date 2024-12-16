import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CompanyColors } from "../models/conpany-colors.model";

@Injectable({
  providedIn: 'root'
})
export class CompanyColorsService {
  private apiUrl = `${environment.backendApi}/companyColors`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Pegue o token armazenado
    if (!token) throw new Error('Token não encontrado.'); // Lance erro se o token não existir
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Obter as cores da empresa
  getColors(): Observable<CompanyColors> {
    const headers = this.getAuthHeaders();
    return this.http.get<CompanyColors>(`${this.apiUrl}`, { headers });
  }

  // Criar ou atualizar cores
  saveColors(colors: CompanyColors): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}`, colors, { headers });
  }

  // Editar cores
  updateColors(colors: CompanyColors): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}`, colors, { headers });
  }

  // Remover cores
  deleteColors(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}`, { headers });
  }
}
