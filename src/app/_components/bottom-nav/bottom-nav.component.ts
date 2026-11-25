import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type MobileTab = 'plan' | 'recipes' | 'settings';

@Component({
  selector: 'app-bottom-nav',
  standalone: false,
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavComponent {
  @Input() active: MobileTab = 'plan';
  @Output() activeChange = new EventEmitter<MobileTab>();

  readonly tabs: { id: MobileTab; icon: string; label: string }[] = [
    { id: 'plan', icon: 'calendar-blank', label: 'NAV_PLAN' },
    { id: 'recipes', icon: 'cooking-pot', label: 'NAV_RECIPES' },
    { id: 'settings', icon: 'gear-six', label: 'NAV_SETTINGS' },
  ];
}
