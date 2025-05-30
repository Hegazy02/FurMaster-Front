import { NgClass } from '@angular/common';
import {
  Component,
  Input,
  input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [FaIconComponent, NgClass],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css',
})
export class ErrorMessageComponent implements OnChanges {
  fadingOut = false;
  errorIcon = faTimesCircle;
  @Input() message: string = 'Something went wrong';
  @Input() show: boolean = false;
  ngOnChanges(changes: SimpleChanges): void {
    if (this.show) {
      this.fadingOut = false;
      setTimeout(() => {
        this.fadingOut = true;
      }, 3000);
    }
  }
}
