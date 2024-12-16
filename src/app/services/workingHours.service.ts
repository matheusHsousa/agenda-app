import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Definição das interfaces
export interface WorkingHour {
  id?: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface Holiday {
  holiday_date: string;
  description: string;
  id?: number;
  isEditing?: boolean
}

export interface TimeOff {
  id?: number;
  time_off_date: string;
  time_off_end_date?: string;
  employee_id: number;
  description: string;
  isEditing?: boolean;
  type_id?: any;
}


@Injectable({
  providedIn: 'root',
})
export class WorkingHoursService {
  private apiUrl = `${environment.backendApi}/working-hours`;

  constructor(private http: HttpClient) { }

  // Função para obter os cabeçalhos de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Pega o token armazenado no localStorage
    if (!token) {
      throw new Error('Token não encontrado.'); // Se não tiver token, lança erro
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Função para obter os horários de funcionamento
  getWorkingHours(): Observable<WorkingHour[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<WorkingHour[]>(this.apiUrl, { headers });
  }

  // Função para salvar os horários de funcionamento
  saveWorkingHours(workingHours: WorkingHour[]): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, { days: workingHours }, { headers });
  }

  // Função para salvar os feriados
  saveHolidays(holidays: Holiday[]): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/holidays`, { holidays }, { headers });
  }

  // Função para obter os feriados
  getHolidays(): Observable<Holiday[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Holiday[]>(`${this.apiUrl}/holidays`, { headers });
  }


  updateHoliday(holiday: Holiday): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/holidays/${holiday.id}`, holiday, { headers });
  }

  // Função para atualizar uma folga programada

  // Função para excluir um feriado
  deleteHoliday(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/holidays/${id}`, { headers });
  }

  // Função para salvar as folgas programadas
  saveTimeOff(timeOff: TimeOff[]): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/time-off`, { timeOff }, { headers });
  }

  // Função para obter as folgas programadas
  getTimeOff(): Observable<TimeOff[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<TimeOff[]>(`${this.apiUrl}/time-off`, { headers });
  }

  // Função para atualizar uma folga programada
  updateTimeOff(timeOff: TimeOff): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/time-off/${timeOff.id}`, timeOff, { headers });
  }

  // Função para excluir uma folga programada
  deleteTimeOff(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/time-off/${id}`, { headers });
  }

  getTimeOffTypes(): Observable<TimeOff[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<TimeOff[]>(`${this.apiUrl}/time-off-types`, { headers });
  }

  getRemainingTime(month: number, year: number, employeeId?: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    let params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
  
    if (employeeId) {
      params = params.set('employeeId', employeeId);
    }
  
    return this.http.get<any[]>(`${this.apiUrl}/remaining-time`, { headers, params });
  }    
}
