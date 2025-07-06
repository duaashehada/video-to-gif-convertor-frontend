import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ConvertComponent} from './convert/convert.component';
import {VideoToGifComponent} from './video-to-gif/video-to-gif.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConvertComponent, VideoToGifComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'video-to-gif-app';
}
