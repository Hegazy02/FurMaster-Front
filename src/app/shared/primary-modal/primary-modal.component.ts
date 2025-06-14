import { NgStyle } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-primary-modal',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './primary-modal.component.html',
  styleUrl: './primary-modal.component.css',
})
export class PrimaryModalComponent implements AfterContentInit {
  renderer = inject(Renderer2);
  @ContentChild('content', { read: ElementRef }) projectedElement!: ElementRef;
  @Input() title: string = '';
  @Input() body: string = '';
  @Input() buttonText: string = 'Save Changes';
  @Input() buttonTextColor: string = '';
  @Output() clickButton = new EventEmitter<void>();
  ngAfterContentInit() {
    if (this.projectedElement) {
      this.addAttributes(this.projectedElement.nativeElement);
    }
  }
  private addAttributes(element: HTMLElement) {
    const attributesToAdd: any = {
      'data-bs-toggle': 'modal',
      'data-bs-target': '#exampleModal',
    };

    Object.keys(attributesToAdd).forEach((key) => {
      this.renderer.setAttribute(element, key, attributesToAdd[key]);
    });
  }
  onClickButton() {
    this.clickButton.emit();
  }
}
