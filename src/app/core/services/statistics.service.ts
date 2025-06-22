import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerGenderStatistics } from '../interfaces/customer-gender-statistics.interface';
import { Endpoints } from '../constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  http = inject(HttpClient);

  getCustomerGenderStatistics(): Observable<{
    data: CustomerGenderStatistics;
  }> | null {
    return this.http.get<{ data: CustomerGenderStatistics }>(
      Endpoints.CUSTOMER_GENDER_STATISTICS
    );
  }
}
