import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { Meal } from '../../interfaces/meal.interface';
import { Recipe } from '../../interfaces/recipe.interface';

@Component({
  selector: 'app-day-column',
  standalone: false,
  templateUrl: './day-column.component.html',
  styleUrl: './day-column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayColumnComponent {
  @Input() day!: Date;
  @Input() plannedMeals: Partial<Meal>[] = [];
  @Input() recipes: Recipe[] | null = null;

  @Output() dragOver = new EventEmitter<{ event: DragEvent, day: Date }>();
  @Output() drop = new EventEmitter<{ event: DndDropEvent, day: Date }>();
  @Output() addRecipe = new EventEmitter<Date>();

  onDragover(event: DragEvent) {
    this.dragOver.emit({ event, day: this.day });
  }

  onDrop(event: DndDropEvent) {
    this.drop.emit({ event, day: this.day });
  }

  onAddRecipe() {
    this.addRecipe.emit(this.day);
  }
}
