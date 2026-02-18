import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoffeeOrder } from '../models/coffee-order.model';
import { CoffeeResponse } from '../models/coffee-response.model';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class CoffeeService {
  private apiUrl = 'http://localhost:5272/api/coffee';

  constructor(private http: HttpClient) {}

  getMenu(): Observable<Menu> {
    return this.http.get<Menu>(`${this.apiUrl}/menu`);
  }

  orderCoffee(order: CoffeeOrder): Observable<CoffeeResponse> {
    return this.http.post<CoffeeResponse>(`${this.apiUrl}/order`, order);
  }
}
