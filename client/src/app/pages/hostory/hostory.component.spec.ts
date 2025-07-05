import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostoryComponent } from './hostory.component';

describe('HostoryComponent', () => {
  let component: HostoryComponent;
  let fixture: ComponentFixture<HostoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
