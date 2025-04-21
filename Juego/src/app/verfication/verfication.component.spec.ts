import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerficationComponent } from './verfication.component';

describe('VerficationComponent', () => {
  let component: VerficationComponent;
  let fixture: ComponentFixture<VerficationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerficationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerficationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
