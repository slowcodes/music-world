import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
      CommonModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  loading = false; 
  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
  constructor(private http: HttpClient) {}

  onSubmit() {
    this.loading = true;
    if (!this.selectedFile) {
      alert('Please select an audio file first.');
      return;
    }
    
    

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://13.61.6.255:8000/upload-audio/', formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'arraybuffer'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          console.log(`Upload progress: ${percentDone}%`);
        } else if (event.type === HttpEventType.Response) {
            console.log('Upload complete');
            // Create a blob and download it
            const audioData = event.body as ArrayBuffer;
            const blob = new Blob([audioData], { type: 'audio/wav' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
           
            this.selectedFile = null;

            a.download = 'remastered.wav';
            a.click();
            window.URL.revokeObjectURL(url);
            window.URL.revokeObjectURL(url);
            this.loading = false; // Hide overlay
        }
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.loading = false;
      }
    });
  }
}
