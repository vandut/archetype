import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ElementRepositoryService } from '../services/element-repository.service';
import { ElementPaletteComponent } from './element-palette.component';
import { environment } from '../../environments/environment';

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
      this.elementRepositoryService.addEditorElement(ElementPaletteComponent.DEFAULT_DIV_TEMPLATE, 100, 100);
      this.elementRepositoryService.addEditorElement(ElementPaletteComponent.DEFAULT_DIV_TEMPLATE, 300, 300);
      this.changeDetectionRef.detectChanges();
    }
  }

}
