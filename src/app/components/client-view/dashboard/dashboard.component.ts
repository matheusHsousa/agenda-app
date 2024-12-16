import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userMenuOpen: boolean = false;
  currentView: string = 'home';
  subMenu: string | null = null;
  isSidebarCollapsed: boolean = true;

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit() {
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout() {
    localStorage.clear();
    this.route.navigate(['/']);
  }

  changeView(view: string) {
    this.currentView = view;
  }

  toggleSubMenu(menu: string) {
    this.subMenu = this.subMenu === menu ? null : menu;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
