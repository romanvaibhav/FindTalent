import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmentPageComponent } from './assesment-page.component';

describe('AssesmentPageComponent', () => {
  let component: AssesmentPageComponent;
  let fixture: ComponentFixture<AssesmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssesmentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssesmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
