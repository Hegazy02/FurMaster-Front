import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-slide-words',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-words.component.html',
  styleUrl: './slide-words.component.css'
})
export class SlideWordsComponent {words = [
  { text: 'Elegant', fontClass: 'font1' },
  { text: 'Modern', fontClass: 'font2' },
  { text: 'Classic', fontClass: 'font3' },
  { text: 'Stylish', fontClass: 'font4' }
 

];

}
