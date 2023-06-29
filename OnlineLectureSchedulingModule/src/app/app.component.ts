import { Component } from '@angular/core';
import { Cloudinary } from '@cloudinary/url-gen';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'OnlineLectureSchedulingModule';

  ngOnInit() {
    const cld = new Cloudinary({ cloud: { cloudName: 'dvl7ah74b' } });
  }
}
