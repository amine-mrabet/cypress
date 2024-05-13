import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '@app/shared/services/loader.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
/**
 * Loader Component to show a spinner when the state's show equals to true
 *
 */
export class LoaderComponent implements OnDestroy, OnInit {
  show = false;
  private subscription: Subscription | undefined;

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.subscription = this.loaderService.loaderState.subscribe(
      (state: boolean) => {
        this.show = state;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
