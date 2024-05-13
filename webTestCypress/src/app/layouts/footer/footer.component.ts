import { Component } from '@angular/core';
/**
 * The bottom footer region
 */
@Component({
  selector: 'app-footer',
  template: '<div class="footer"><ng-content></ng-content></div>'
})
export class FooterComponent {
  constructor() {}
}
