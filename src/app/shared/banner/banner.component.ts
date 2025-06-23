import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
 imports: [RouterModule, CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
@Input() title!: string;
  @Input() description!: string;
  @Input() imageUrl!: string;

}
