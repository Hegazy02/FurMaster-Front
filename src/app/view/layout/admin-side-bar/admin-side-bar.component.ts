import { Component } from '@angular/core';
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
export class AdminSidebarComponent {
  isCollapsed = false;

  menuSections: MenuSection[] = [
    {
      title: 'MAIN MENU',
      items: [
        { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
        { icon: 'shopping_cart', label: 'Order Management', route: '/orders' },
        {
          icon: 'people',
          label: 'Customers',
          route: '/customers',
          active: true,
        },
        { icon: 'local_offer', label: 'Coupon Code', route: '/coupons' },
        { icon: 'category', label: 'Categories', route: '/categories' },
        { icon: 'receipt', label: 'Transaction', route: '/transactions' },
        { icon: 'star', label: 'Brand', route: '/brands' },
      ],
    },
    {
      title: 'PRODUCTS',
      items: [
        { icon: 'add_circle', label: 'Add Products', route: '/products/add' },
        { icon: 'inventory', label: 'Product List', route: '/products' },
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

  constructor(private router: Router) {}

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
