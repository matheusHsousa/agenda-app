import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../../services/employee.service';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-employees-services',
  templateUrl: './employees-services.component.html',
  styleUrls: ['./employees-services.component.scss']
})
export class EmployeesServicesComponent {
  employees: any[] = [];
  services: any[] = [];
  activeTab: string = 'employees';

  employeeForm = { id: null, name: '', email: '', position: '' };
  editingEmployee = false;

  serviceForm = {
    id: null,
    name: '',
    price: 0,
    is_generic: false,
    employee_ids: [] as number[]
  };

  editingService = false;

  constructor(
    private employeesService: EmployeesService,
    private servicesService: ServicesService
  ) { }

  ngOnInit() {
    this.loadEmployees();
    this.loadServices();
  }

  // Employees
  loadEmployees() {
    this.employeesService.getEmployees().subscribe((data: any[]) => {
      this.employees = data;
    });
  }

  addOrUpdateEmployee() {
    if (this.editingEmployee) {
      this.employeesService.updateEmployee(this.employeeForm).subscribe(() => {
        this.loadEmployees();
        this.resetEmployeeForm();
      });
    } else {
      this.employeesService.addEmployee(this.employeeForm).subscribe(() => {
        this.loadEmployees();
        this.resetEmployeeForm();
      });
    }
  }

  editEmployee(employee: any) {
    this.employeeForm = { ...employee };
    this.editingEmployee = true;
  }

  deleteEmployee(id: number) {
    this.employeesService.deleteEmployee(id).subscribe(() => {
      this.loadEmployees();
    });
  }

  cancelEditingEmployee() {
    this.resetEmployeeForm();
  }

  resetEmployeeForm() {
    this.employeeForm = { id: null, name: '', email: '', position: '' };
    this.editingEmployee = false;
  }

  // Services
  loadServices() {
    this.servicesService.getServices().subscribe((data: any[]) => {
      // Mapeia corretamente os serviços recebidos para o formato esperado
      this.services = data.map(service => ({
        ...service,
        name: service.service_name, // Mapeia 'service_name' para 'name' (usado no formulário e exibição)
        assigned_employees: service.assigned_employees || [], // Garante que assigned_employees é uma lista
      }));
    });
  }

  addOrUpdateService() {
    if (this.serviceForm.is_generic) {
      this.serviceForm.employee_ids = this.employees.map((employee) => employee.id);
    }

    if (this.editingService) {
      this.servicesService.updateService(this.serviceForm).subscribe(() => {
        this.loadServices();
        this.resetServiceForm();
      });
    } else {
      this.servicesService.addService(this.serviceForm).subscribe(() => {
        this.loadServices();
        this.resetServiceForm();
      });
    }
  }

  editService(service: any) {
    this.serviceForm = {
      id: service.service_id, // Corrigir para usar o campo correto do backend
      name: service.name,
      price: parseFloat(service.price), // Garantir que o preço seja um número
      is_generic: !!service.is_generic, // Converter para boolean
      employee_ids: service.assigned_employees.map((emp: { employee_id: number }) => emp.employee_id),
    };
    this.editingService = true;
  }

  deleteService(id: number) {
    this.servicesService.deleteService(id).subscribe(() => {
      this.loadServices();
    });
  }

  cancelEditingService() {
    this.resetServiceForm();
  }

  resetServiceForm() {
    this.serviceForm = { id: null, name: '', price: 0, is_generic: false, employee_ids: [] };
    this.editingService = false;
  }

  toggleGenericService() {
    if (this.serviceForm.is_generic) {
      // Limpa os funcionários selecionados ao alternar para genérico
      this.serviceForm.employee_ids = [];
    }
  }
}
