import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { Recipe } from '../../interfaces/recipe.interface';
import { SectionGroup } from '../../interfaces/section-group.interface';

@Component({
  selector: 'app-day-column',
  standalone: false,
  templateUrl: './day-column.component.html',
  styleUrl: './day-column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayColumnComponent {
  @Input() day!: Date;
  @Input() groups: SectionGroup[] = [];
  @Input() showHeadings = false;
  @Input() recipes: Recipe[] | null = null;

  @Output() drop = new EventEmitter<{ event: DndDropEvent, day: Date, sectionId: number }>();
  @Output() addRecipe = new EventEmitter<{ day: Date, sectionId: number }>();

  onDrop(event: DndDropEvent, sectionId: number) {
    this.drop.emit({ event, day: this.day, sectionId });
  }

  onAddRecipe(sectionId: number) {
    this.addRecipe.emit({ day: this.day, sectionId });
  }
}
