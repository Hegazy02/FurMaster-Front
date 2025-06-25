import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Color } from '../interfaces/product.model';
import { Observable } from 'rxjs';
import { Endpoints } from '../constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  http = inject(HttpClient);
  getColors(): Observable<{ data: Color[] }> | null {
    return this.http.get<{ data: Color[] }>(Endpoints.COLORS);
  }
}
