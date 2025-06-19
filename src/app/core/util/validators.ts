export class AppValidators {
  static isValidImageFile(file: File, maxSizeInMB: number): boolean {
    const fileMaxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return false;
    }

    if (file.size > fileMaxSizeInBytes) {
      alert(`File size must be less than ${maxSizeInMB}MB`);
      return false;
    }

    return true;
  }
}
