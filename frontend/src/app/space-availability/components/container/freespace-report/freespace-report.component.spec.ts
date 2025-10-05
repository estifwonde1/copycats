import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';

import { FreespaceReportComponent } from './freespace-report.component';

describe('FreespaceReportComponent', () => {
  let component: FreespaceReportComponent;
  let fixture: ComponentFixture<FreespaceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreespaceReportComponent ],
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        MessageService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreespaceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
