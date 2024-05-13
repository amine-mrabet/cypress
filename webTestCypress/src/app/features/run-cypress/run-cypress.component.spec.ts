import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunCypressComponent } from './run-cypress.component';

describe('RunCypressComponent', () => {
  let component: RunCypressComponent;
  let fixture: ComponentFixture<RunCypressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RunCypressComponent]
    });
    fixture = TestBed.createComponent(RunCypressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
