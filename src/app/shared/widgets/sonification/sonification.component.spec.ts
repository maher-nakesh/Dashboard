import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SonificationComponent } from './sonification.component';

describe('SonificationComponent', () => {
  let component: SonificationComponent;
  let fixture: ComponentFixture<SonificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SonificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SonificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
