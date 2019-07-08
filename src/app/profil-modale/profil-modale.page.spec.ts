import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilModalePage } from './profil-modale.page';

describe('ProfilModalePage', () => {
  let component: ProfilModalePage;
  let fixture: ComponentFixture<ProfilModalePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilModalePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilModalePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
