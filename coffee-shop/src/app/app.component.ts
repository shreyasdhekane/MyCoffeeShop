import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CoffeeService } from './services/coffee.service';
import { CoffeeOrder } from './models/coffee-order.model';
import { CoffeeResponse } from './models/coffee-response.model';
import { Menu } from './models/menu.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CoffeeService],
})
export class AppComponent implements OnInit {
  menu: Menu = { baseCoffees: [], addOns: [] };
  selectedBaseCoffee: string = '';
  selectedAddOns: string[] = [];
  orderResult: CoffeeResponse | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(private coffeeService: CoffeeService) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu(): void {
    this.coffeeService.getMenu().subscribe({
      next: (data) => {
        console.log('Menu loaded:', data);
        this.menu = data;
        if (this.menu.baseCoffees.length > 0) {
          this.selectedBaseCoffee = this.menu.baseCoffees[0];
        }
      },
      error: (error) => {
        console.error('Error loading menu:', error);
        this.error = 'Failed to load menu. Please make sure the backend is running.';
      },
    });
  }

  onAddOnChange(addOn: string, event: any): void {
    if (event.target.checked) {
      this.selectedAddOns.push(addOn);
    } else {
      const index = this.selectedAddOns.indexOf(addOn);
      if (index > -1) {
        this.selectedAddOns.splice(index, 1);
      }
    }
    console.log('Selected add-ons:', this.selectedAddOns);
  }

  getAddOnPrice(addOn: string): string {
    const prices: { [key: string]: string } = {
      Milk: '0.50',
      Sugar: '0.25',
      WhippedCream: '0.75',
      Caramel: '0.60',
    };
    return prices[addOn] || '0.00';
  }

  getBasePrice(baseCoffee: string): string {
    const prices: { [key: string]: string } = {
      Espresso: '2.50',
      Latte: '3.50',
      Cappuccino: '3.00',
    };
    return prices[baseCoffee] || '0.00';
  }

  getAddOnsTotal(): string {
    const total = this.selectedAddOns.reduce((sum, addOn) => {
      return sum + parseFloat(this.getAddOnPrice(addOn));
    }, 0);
    return total.toFixed(2);
  }

  placeOrder(): void {
    console.log('Placing order...');

    if (!this.selectedBaseCoffee) {
      this.error = 'Please select a coffee type';
      return;
    }

    this.loading = true;
    this.error = null;

    const order: CoffeeOrder = {
      baseCoffee: this.selectedBaseCoffee,
      addOns: this.selectedAddOns,
    };

    console.log('Order payload:', order);

    this.coffeeService.orderCoffee(order).subscribe({
      next: (result) => {
        console.log('Order result:', result);
        this.orderResult = result;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error placing order:', error);
        this.error = 'Failed to place order. Please try again.';
        this.loading = false;
      },
    });
  }

  resetOrder(): void {
    console.log('Resetting order...');

    this.selectedBaseCoffee = this.menu.baseCoffees[0] || '';
    this.selectedAddOns = [];
    this.orderResult = null;
    this.error = null;

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = false;
    });

    console.log('Reset complete. State:', {
      base: this.selectedBaseCoffee,
      addOns: this.selectedAddOns,
      orderResult: this.orderResult,
    });
  }

  formatAddOnName(name: string): string {
    return name.replace(/([A-Z])/g, ' $1').trim();
  }
}
