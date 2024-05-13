import {
  Component,
  TemplateRef,
  ContentChildren,
  AfterContentInit,
  QueryList
} from '@angular/core';
import { PlmTemplateDirective } from '@app/shared/directives/plm-template.directive';

/**
 * The top header region
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  host: {'class': 'app-header-custom'}
})
export class HeaderComponent implements AfterContentInit {
  @ContentChildren(PlmTemplateDirective) templates: QueryList<
  PlmTemplateDirective
  > | any;
  leftTemplate: TemplateRef<any> | any;
  rightTemplate: TemplateRef<any> | any;
  centerTemplate: TemplateRef<any> | any;
  constructor() {}

  ngAfterContentInit() {
    this.templates.forEach((item : any) => {
      switch (item.getType()) {
        case 'leftHeader':
          this.leftTemplate = item.template;
          break;
        case 'centerHeader':
          this.centerTemplate = item.template;
          break;
        case 'rightHeader':
          this.rightTemplate = item.template;
          break;
      }
    });
  }
}
