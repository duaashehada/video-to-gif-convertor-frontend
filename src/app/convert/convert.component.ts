import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-convert',
  imports: [
    NgIf,
    FormsModule,
    RouterLink
  ],
  templateUrl: './convert.component.html',
  styleUrl: './convert.component.css'
})
export class ConvertComponent {
  selectedFile: File | null = null;
  gifUrl: any = null;
  loading = false;
  fps = 10;
  scale = '1200:-1';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  convert() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('video', this.selectedFile);
    formData.append('fps', this.fps.toString());
    formData.append('scale', this.scale);

    this.loading = true;
    this.http.post<any>('http://localhost:3000/convert', formData).subscribe({
      next: (res) => {
        this.gifUrl = this.sanitizer.bypassSecurityTrustUrl(res.gifUrl);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
