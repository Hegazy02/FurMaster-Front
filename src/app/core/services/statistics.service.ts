import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerGenderStatistics } from '../interfaces/customer-gender-statistics.interface';
import { Endpoints } from '../constants/endpoints';
import {
  BestSellingProductsResponse,
  TotalOrdersAmountStatisticsResoponse,
  TotalOrdersStatisticsResoponse,
} from '../interfaces/total-orders-statistics.interface';

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
  getTotalOrdersStatistics(
    from: Date,
    to: Date
  ): Observable<TotalOrdersStatisticsResoponse> | null {
    return this.http.get<TotalOrdersStatisticsResoponse>(
      Endpoints.TOTAL_ORDERS_STATISTICS,
      {
        params: { from: from.toISOString(), to: to.toISOString() },
      }
    );
  }
  getTotalOrdersAmountStatistics(
    from: Date,
    to: Date
  ): Observable<TotalOrdersAmountStatisticsResoponse> | null {
    return this.http.get<TotalOrdersAmountStatisticsResoponse>(
      Endpoints.TOTAL_ORDERS_AMOUNT_STATISTICS,
      {
        params: { from: from.toISOString(), to: to.toISOString() },
      }
    );
  }
  getBestSellingProducts(
    limit: number,
    from?: Date,
    to?: Date
  ): Observable<BestSellingProductsResponse> | null {
    const params = new HttpParams().set('limit', limit);
    if (from) params.set('from', from.toISOString());

    if (to) params.set('to', to.toISOString());

    return this.http.get<BestSellingProductsResponse>(
      Endpoints.BEST_SELLING_PRODUCTS,
      {
        params: params,
      }
    );
  }
}
