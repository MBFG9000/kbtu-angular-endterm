import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedSneakersComponent } from './detailed-sneakers.component';

describe('DetailedSneakersComponent', () => {
  let component: DetailedSneakersComponent;
  let fixture: ComponentFixture<DetailedSneakersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedSneakersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedSneakersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
