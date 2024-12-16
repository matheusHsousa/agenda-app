import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-view',
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.scss'],
})
export class ClientViewComponent implements OnInit {
  lojaId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.lojaId = this.route.snapshot.queryParamMap.get('id'); // Obter loja via query param
  }
}
