import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsUseComponent } from './terms-use.component';

describe('TermsUseComponent', () => {
  let component: TermsUseComponent;
  let fixture: ComponentFixture<TermsUseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermsUseComponent],
    });
    fixture = TestBed.createComponent(TermsUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
