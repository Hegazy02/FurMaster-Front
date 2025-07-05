import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideWordsComponent } from './slide-words.component';

describe('SlideWordsComponent', () => {
  let component: SlideWordsComponent;
  let fixture: ComponentFixture<SlideWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideWordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlideWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
