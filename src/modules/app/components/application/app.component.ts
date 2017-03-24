import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ElementRepositoryService } from '../../services/element-repository.service';
import { PaletteComponent } from '../palette/palette.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  constructor(private elementRepositoryService: ElementRepositoryService,
              private changeDetectionRef : ChangeDetectorRef) { }

  public ngAfterViewInit() {
    if (!environment.production) {
      for (let i = 1; i < 3; i++) {
        this.elementRepositoryService.addEditorElement(PaletteComponent.DEFAULT_DIV_TEMPLATE, i*120, i*120);
      }
      this.changeDetectionRef.detectChanges();
    }
  }

}
