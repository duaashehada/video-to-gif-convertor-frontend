import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-video-to-gif',
  templateUrl: './video-to-gif.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./video-to-gif.component.css']
})
export class VideoToGifComponent {
  ffmpeg = new FFmpeg();
  gifUrl: SafeResourceUrl | null = null;
  loading = false;
  selectedFile: File | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];
    await this.convertToGif(this.selectedFile);
  }

  async convertToGif(file: File): Promise<void> {
    this.loading = true;
    this.gifUrl = null;

    try {
      if (!this.ffmpeg.loaded) {
        await this.ffmpeg.load();
      }

      // Write the video file to FFmpeg's in-memory filesystem
      await this.ffmpeg.writeFile('input.mp4', await fetchFile(file));

      // Step 1: Generate palette
      await this.ffmpeg.exec([
        '-i', 'input.mp4',
        '-vf', 'fps=10,scale=480:-1:flags=lanczos,palettegen',
        'palette.png'
      ]);

      // Step 2: Create GIF using palette
      await this.ffmpeg.exec([
        '-i', 'input.mp4',
        '-i', 'palette.png',
        '-filter_complex',
        'fps=10,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=none',
        '-loop', '0',
        'output.gif'
      ]);

      // Read output GIF and create object URL
      const data = await this.ffmpeg.readFile('output.gif');
      const blob = new Blob([data], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      this.gifUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } catch (error) {
      console.error('GIF conversion failed:', error);
      alert('Something went wrong during GIF conversion.');
    } finally {
      this.loading = false;
    }
  }
}
