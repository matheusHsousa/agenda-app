import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { faCheckCircle, faChevronDown, faChevronUp, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WorkingHoursService } from 'src/app/services/workingHours.service';


@Component({
  selector: 'app-home-dash',
  templateUrl: './home-dash.component.html',
  styleUrls: ['./home-dash.component.scss']
})
export class HomeDashComponent implements OnInit {
  professionals: any[] = []; // Lista de profissionais
  appointments: any[] = []; // Todos os agendamentos
  dailyAppointments: any[] = []; // Agendamentos do dia
  groupedAppointments: any[] = []; // Agendamentos agrupados por dia (semana/mês)
  selectedDate: Date = new Date();
  currentMonth: Date = new Date();
  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  calendarDays: any[] = []; // Dias do mês exibidos no calendário
  period: string = 'daily'; // Período selecionado
  selectedProfessional: string = 'all'; // Profissional selecionado
  currentWeekRange: string = ''; // Intervalo da semana atual
  faCheckCircle = faCheckCircle;
  faExclamationTriangle = faExclamationTriangle;
  faTimesCircle = faTimesCircle;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  mockAppointments: any[] = [];

  constructor(
    private authService: AuthService, 
    public dialog: MatDialog, 
    private workinHoursService: WorkingHoursService) { }

  ngOnInit() {
    this.fetchProfessionals();
    this.fetchAppointments();
    this.generateCalendarDays();
    this.updateWeekRange();
    this.remainingTime(); 
  }

  remainingTime(): void {
    const month = this.currentMonth.getMonth() + 1; // Meses começam em 0 no JS
    const year = this.currentMonth.getFullYear();
    const employeeId: string | undefined = this.selectedProfessional !== 'all' ? this.selectedProfessional : undefined;
  
    this.workinHoursService.getRemainingTime(month, year, employeeId).subscribe({
      next: (data) => {
        console.log('Tempo restante:', data);
        this.mockAppointments = data; // Atualiza os dados do calendário com os resultados da API
        this.generateCalendarDays(); // Recria os dias do calendário com os dados atualizados
      },
      error: (err) => {
        console.error('Erro ao buscar tempo restante:', err);
      },
    });
  }    

  // Busca todos os profissionais
  fetchProfessionals(): void {
    this.authService.getProfessionals().subscribe({
      next: (data) => (this.professionals = data),
      error: (err) => console.error('Erro ao carregar profissionais:', err)
    });
  }

  // Busca todos os agendamentos
  fetchAppointments(): void {
    this.authService.getAllSchedules().subscribe({
      next: (data) => {
        this.appointments = data.map((appt: any) => ({
          ...appt,
          start_time: new Date(appt.start_time),
          end_time: new Date(appt.end_time)
        }));
        this.filterAppointments(); // Atualiza os filtros iniciais
      },
      error: (err) => console.error('Erro ao carregar agendamentos:', err)
    });
  }

  // Filtro por profissional e período
  filterAppointments(): void {
    let filteredAppointments = this.appointments;

    if (this.selectedProfessional !== 'all') {
      filteredAppointments = filteredAppointments.filter(
        appt => appt.employee_id === parseInt(this.selectedProfessional)
      );
    }

    if (this.period === 'daily') {
      this.dailyAppointments = filteredAppointments.filter(
        appt => this.isSameDate(appt.start_time, this.selectedDate)
      );
    } else {
      this.groupedAppointments = this.groupByDate(filteredAppointments);
    }
  }

  onProfessionalChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedProfessional = selectElement.value;
    this.remainingTime(); // Atualiza os dados de tempo restante com base na nova seleção
    this.filterAppointments();
  }  

  // Atualiza o período selecionado
  onPeriodChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.period = selectElement.value;
    this.filterAppointments();
  }

  // Verifica se duas datas são no mesmo dia
  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // Agrupa agendamentos por data
  groupByDate(appointments: any[]): any[] {
    const grouped: { [key: string]: any[] } = {};

    appointments.forEach(appt => {
      const dateKey = appt.start_time.toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(appt);
    });

    return Object.entries(grouped).map(([date, appts]) => ({
      date: new Date(date),
      appointments: appts
    }));
  }

  // Gera os dias do mês para o calendário grande
  generateCalendarDays(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
  
    const daysInMonth = [];
    const totalDayMinutes = 480; // 8 horas úteis = 480 minutos
  
    // Preenche os dias antes do início do mês
    for (let i = 0; i < firstDay.getDay(); i++) {
      daysInMonth.push({ date: null, appointments: [] });
    }
  
    // Preenche os dias do mês
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateKey = date.toISOString().split('T')[0];
  
      // Busca no mock pela data
      const appointmentData = this.mockAppointments.find(a => a.date === dateKey);
      const remainingMinutes = appointmentData ? appointmentData.remainingMinutes : totalDayMinutes;
  
      // Calcula o percentual de tempo restante
      const remainingPercentage = (remainingMinutes / totalDayMinutes) * 100;
  
      daysInMonth.push({ date, remainingMinutes, remainingPercentage });
    }
  
    // Preenche os dias após o fim do mês
    while (daysInMonth.length % 7 !== 0) {
      daysInMonth.push({ date: null, appointments: [] });
    }
  
    this.calendarDays = daysInMonth;
  }
  
  // Navega para o mês anterior
  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.remainingTime(); // Atualiza os dados do novo mês
    this.generateCalendarDays();
  }
  
  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.remainingTime(); // Atualiza os dados do novo mês
    this.generateCalendarDays();
  }
  
  // Atualiza a data selecionada no calendário
  onDayClick(day: any): void {
    if (day.date) {
      this.selectedDate = new Date(day.date);
      this.filterAppointments();
    }
  }

  // Atualiza o intervalo da semana atual
  updateWeekRange(): void {
    const startOfWeek = new Date(this.selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    this.currentWeekRange = `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
  }

  // Navega para a semana anterior
  prevWeek(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() - 7);
    this.updateWeekRange();
    this.filterAppointments();
  }

  // Navega para a próxima semana
  nextWeek(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() + 7);
    this.updateWeekRange();
    this.filterAppointments();
  }

  // Formata uma data para "dd/MM/yyyy"
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Estilo para o status do agendamento
  getAppointmentStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'appointment-confirmed';
      case 'pending':
        return 'appointment-pending';
      case 'canceled':
        return 'appointment-canceled';
      default:
        return '';
    }
  }

  toggleAppointmentDetails(appointmentId: number): void {
    // Atualiza o estado de expansão para os agendamentos diários
    if (this.period === 'daily') {
      this.dailyAppointments = this.dailyAppointments.map(appointment => {
        if (appointment.id === appointmentId) {
          return { ...appointment, expanded: !appointment.expanded };
        }
        return appointment;
      });
    }

    // Atualiza o estado de expansão para os agendamentos agrupados (semana/mês)
    if (this.period === 'weekly' || this.period === 'monthly') {
      this.groupedAppointments = this.groupedAppointments.map(group => ({
        ...group,
        appointments: group.appointments.map((appointment: { id: number; expanded: any; }) => {
          if (appointment.id === appointmentId) {
            return { ...appointment, expanded: !appointment.expanded };
          }
          return appointment;
        })
      }));
    }
  }
  // Método para retornar o ícone com base no status
  getStatusIcon(status: string) {
    switch (status) {
      case 'confirmed':
        return this.faCheckCircle;
      case 'pending':
        return this.faExclamationTriangle;
      case 'canceled':
        return this.faTimesCircle;
      default:
        return this.faExclamationTriangle;
    }
  }

  openAddAppointmentModal(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('dialog closed');
    });
  }

  getRemainingTimeClass(day: any): string {
    if (!day.date) return ''; // Dias vazios

    const percentage = day.remainingPercentage;

    if (percentage === 100) return 'fully-available';
    if (percentage > 50) return 'partially-available';
    if (percentage > 0) return 'mostly-occupied';
    return 'fully-occupied'; // 0% restante
  }
}
