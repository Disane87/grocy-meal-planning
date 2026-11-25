import { ComponentFixture, TestBed } from '@angular/core/testing';
import dayjs from 'dayjs';
import { DayStripComponent } from './day-strip.component';

describe('DayStripComponent', () => {
  let fixture: ComponentFixture<DayStripComponent>;
  const weekStart = dayjs('2026-11-23');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [DayStripComponent] }).compileComponents();
    fixture = TestBed.createComponent(DayStripComponent);
    fixture.componentRef.setInput('weekStart', weekStart);
    fixture.componentRef.setInput('selectedDay', weekStart.add(2, 'day'));
    fixture.componentRef.setInput('plannedDays', new Set(['2026-11-23', '2026-11-27']));
    fixture.detectChanges();
  });

  const days = (): HTMLElement[] => Array.from(fixture.nativeElement.querySelectorAll('.day'));

  it('renders 7 days', () => {
    expect(days().length).toBe(7);
  });

  it('shows a dot only on planned days', () => {
    const dotted = days().map(d => !!d.querySelector('.dot.on'));
    expect(dotted).toEqual([true, false, false, false, true, false, false]);
  });

  it('marks the selected day', () => {
    expect(days()[2].classList).toContain('on');
    expect(days()[2].getAttribute('aria-pressed')).toBe('true');
  });

  it('emits the tapped day', () => {
    let picked: dayjs.Dayjs | undefined;
    fixture.componentInstance.daySelect.subscribe(d => (picked = d));
    days()[4].click();
    expect(picked?.format('YYYY-MM-DD')).toBe('2026-11-27');
  });
});
