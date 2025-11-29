import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SneakerCardSmComponent } from './sneaker-card-sm.component';

describe('SneakerCardSmComponent', () => {
  let component: SneakerCardSmComponent;
  let fixture: ComponentFixture<SneakerCardSmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SneakerCardSmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SneakerCardSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
