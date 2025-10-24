import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DarkModeToggleComponent } from './dark-mode-toggle.component';

describe('DarkModeToggleComponent', () => {
    let component: DarkModeToggleComponent;
    let fixture: ComponentFixture<DarkModeToggleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DarkModeToggleComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DarkModeToggleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display theme toggle button', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('button')).toBeTruthy();
    });

    it('should display theme selector', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('select')).toBeTruthy();
    });
});