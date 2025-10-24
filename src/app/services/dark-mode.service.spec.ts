import { DarkModeService } from '../services/dark-mode.service';
import { TestBed } from '@angular/core/testing';

describe('DarkModeService', () => {
    let service: DarkModeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DarkModeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have default theme', () => {
        expect(['light', 'dark', 'system']).toContain(service.theme());
    });

    it('should toggle theme', () => {
        const initialTheme = service.theme();
        service.toggle();
        expect(service.theme()).not.toBe(initialTheme);
    });
});