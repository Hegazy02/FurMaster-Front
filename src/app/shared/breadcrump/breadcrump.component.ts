import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrump.component.html'
})
export class BreadcrumbComponent {
@Input() items: { label: string; link?: string; queryParams?: any }[] = [];
}
