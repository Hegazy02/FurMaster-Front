import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Endpoints } from '../../../../core/constants/endpoints';

@Component({
  standalone: true,
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
  imports: [CommonModule],
})
export class SuccessComponent implements OnInit {
  sessionId!: string;
  order: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.sessionId = params['session_id'];
      if (this.sessionId) {
        console.log(this.sessionId);
        this.http
          .get(`${Endpoints.BASE_URL}/api/orders/by-session/${this.sessionId}`)
          .subscribe({
            next: (res) => {
              console.log('Order response:', res);
              this.order = res;
            },
            error: (err) => console.error('Order fetch error:', err),
          });
      } else {
        console.warn('No session_id found in URL');
      }
    });
  }

  showDetails: boolean = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}
