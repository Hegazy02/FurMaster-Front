import { NgClass } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faTimesCircle,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-floating-message',
  standalone: true,
  imports: [FaIconComponent, NgClass],
  templateUrl: './floating-message.component.html',
  styleUrl: './floating-message.component.css',
})
export class FloatingMessageComponent implements OnChanges {
  fadingOut = false;
  errorIcon = faTimesCircle;
  successIcon = faCheckCircle;
  @Input() message: string = 'Something went wrong';
  @Input() show: boolean = false;
  @Input() type: MessageType = MessageType.Error;
  MessageType = MessageType;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.show) {
      this.fadingOut = false;
      setTimeout(() => {
        this.fadingOut = true;
      }, 3000);
    }
  }
}
export enum MessageType {
  Success,
  Error,
}
