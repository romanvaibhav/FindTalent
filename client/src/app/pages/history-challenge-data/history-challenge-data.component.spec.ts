import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryChallengeDataComponent } from './history-challenge-data.component';

describe('HistoryChallengeDataComponent', () => {
  let component: HistoryChallengeDataComponent;
  let fixture: ComponentFixture<HistoryChallengeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryChallengeDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryChallengeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
