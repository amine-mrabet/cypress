import { Component } from '@angular/core';
/**
 * The main body region
 */
@Component({
  selector: 'app-body',
  host: {'class': 'app-body'},
  template: '<div class="app-body-custom"><ng-content></ng-content></div>'
})
export class BodyComponent {
  constructor() {}
}
