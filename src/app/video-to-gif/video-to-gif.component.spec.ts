import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoToGifComponent } from './video-to-gif.component';

describe('VideoToGifComponent', () => {
  let component: VideoToGifComponent;
  let fixture: ComponentFixture<VideoToGifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoToGifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoToGifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
