import { Component } from '@angular/core';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  }
  /*ngOnInit() {
  this.http.post('/api/orders/complete', { userId }).subscribe(() => {
    // تحديث الحالة في الـ frontend
    this.cartService.clearCart();
    this.router.navigate(['/my-orders']);
  });
}
*/


