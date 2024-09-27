import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalDetailsComponent } from './statistical-details.component';

describe('StatisticalDetailsComponent', () => {
  let component: StatisticalDetailsComponent;
  let fixture: ComponentFixture<StatisticalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticalDetailsComponent]
    });
    fixture = TestBed.createComponent(StatisticalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
