import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardPagePage } from './admin-dashboard-page.page';

describe('AdminDashboardPagePage', () => {
  let component: AdminDashboardPagePage;
  let fixture: ComponentFixture<AdminDashboardPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
