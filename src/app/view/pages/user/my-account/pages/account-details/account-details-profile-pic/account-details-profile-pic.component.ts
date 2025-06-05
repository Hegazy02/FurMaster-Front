import { Component, EventEmitter, inject, Output } from '@angular/core';
import { UserService } from '../../../../../../../core/services/user.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-account-details-profile-pic',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './account-details-profile-pic.component.html',
  styleUrl: './account-details-profile-pic.component.css',
})
export class AccountDetailsProfilePicComponent {
  faCamera = faCamera;
  accountDetailsService = inject(UserService);
  image =
    this.accountDetailsService.user.image ??
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  @Output() imageFile = new EventEmitter<File>();

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.imageFile.emit(file);
    }
  }
}
