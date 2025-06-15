import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Endpoints } from '../constants/endpoints';
import { Observable } from 'rxjs/internal/Observable';
import { PaymentMethod } from '../interfaces/payment-method.interface';

@Injectable({
  providedIn: 'root',
})
export class PaymetMethodsService {
  http = inject(HttpClient);
  getPaymentMethods(): Observable<PaymentMethod[]> | null {
    return this.http.get<PaymentMethod[]>(Endpoints.PAYMENT_METHODS);
  }
  updatePaymentMethod(
    cardId: string,
    data: any
  ): Observable<PaymentMethod[]> | null {
    console.log('id', cardId);

    return this.http.patch<PaymentMethod[]>(
      Endpoints.PAYMENT_METHODS + `/${cardId}`,
      data
    );
  }
  deletePaymentMethod(cardId: string): Observable<PaymentMethod> | null {
    return this.http.delete<PaymentMethod>(
      Endpoints.PAYMENT_METHODS + `/${cardId}`
    );
  }
}
