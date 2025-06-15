import { Injectable } from '@angular/core';
//import { Order } from '@stripe/stripe-js';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Data } from '@angular/router';
import { Endpoints } from '../constants/endpoints';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Order } from '../interfaces/order.interface';






@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient) { }





  getUserOrders(
    page: number,
    limit: number,
    status: string,
    sort: string,
    minPrice?: number,
    maxPrice?: number,
    dateFrom?: string,
    dateTo?: string
  ): Observable<ApiResponse<Order[]>> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('status', status || '')
      .set('sort', sort || '');

    if (minPrice !== undefined) params = params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params = params.set('maxPrice', maxPrice.toString());
    if (dateFrom) params = params.set('dateFrom', dateFrom);
    if (dateTo) params = params.set('dateTo', dateTo);

    return this.http.get<ApiResponse<Order[]>>(Endpoints.ORDER, { params });
  }




}
