import { Component, ViewChild } from '@angular/core';
import { BootstrapSnackbarComponent } from './shared/bootstrap-snackbar/bootstrap-snackbar.component';
import { SnackbarService } from './services/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  @ViewChild(BootstrapSnackbarComponent) bootstrapSnackbar!: BootstrapSnackbarComponent;

  title = 'agenda-app';
  isAuthenticated: boolean = false;

  constructor(private snackbarService: SnackbarService) {}


  ngOnInit(){
    let token = localStorage.getItem('token')
    this.isAuthenticated = token ? true:false
    this.snackbarService.snackBarEmitter.subscribe(data => {
      if (this.bootstrapSnackbar) {
        this.bootstrapSnackbar.showSnackbar(data.message, data.color, data.icon, data.action);
      }
    });
  }

}
