import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  active?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [],
  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.css',
})
export class AdminSidebarComponent implements OnInit {
  isCollapsed = false;
  private router = inject(Router);

  menuSections: MenuSection[] = [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'dashboard', label: 'Dashboard', route: '/admin' },
        {
          icon: 'shopping_cart',
          label: 'Order Management',
          route: '/admin/orders',
        },
        {
          icon: 'people',
          label: 'Customers',
          route: '/admin/customers',
        },
        { icon: 'local_offer', label: 'Coupon Code', route: '/coupons' },
        { icon: 'category', label: 'Categories', route: '/admin/categories' },
        { icon: 'receipt', label: 'Transaction', route: '/transactions' },
        { icon: 'star', label: 'Brand', route: '/brands' },
      ],
    },
    {
      title: 'PRODUCTS',
      items: [
        {
          icon: 'add_circle',
          label: 'Add Products',
          route: '/admin/add-product',
        },
        { icon: 'inventory', label: 'Product List', route: '/admin/products' },
      ],
    },
    {
      title: 'ADMIN',
      items: [
        {
          icon: 'admin_panel_settings',
          label: 'Manage Admins',
          route: '/admin/manage',
        },
        { icon: 'settings', label: 'Admin Roles', route: '/admin/roles' },
      ],
    },
  ];

  ngOnInit(): void {
    this.menuSections.forEach((section) => {
      section.items.forEach((item) => {
        if (!this.router.url.includes(item.route)) {
          return;
        }
        const QuestionIndex = this.router.url.indexOf('?');
        let temp = this.router.url;
        if (QuestionIndex > 0) {
          temp = this.router.url.slice(0, QuestionIndex);
        }
        if (temp === item.route) {
          item.active = true;
        }
      });
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  navigateTo(route: string) {
    // Update active state
    this.menuSections.forEach((section) => {
      section.items.forEach((item) => {
        item.active = item.route === route;
      });
    });

    this.router.navigate([route]);
  }
}
