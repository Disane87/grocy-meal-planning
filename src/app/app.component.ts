import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import { Subject, BehaviorSubject } from 'rxjs';

import { GrocyService } from './grocy.service';
import { Meal } from './interfaces/meal.interface';
import { Recipe } from './interfaces/recipe.interface';
import { RecipeDragData } from './interfaces/recipe-drag-data.interface';
import { DndDropEvent } from 'ngx-drag-drop';
import { AppConfigService } from './appconfig.service';
import { ReleaseNotesService } from './services/release-notes.service';
import { MatDialog } from '@angular/material/dialog';
import { ReleaseNotesModalComponent } from './_components/release-notes-modal/release-notes-modal.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AppComponent implements OnInit {
  public btoa = btoa;

  constructor(
    private grocyService: GrocyService,
    private route: ActivatedRoute,
    private appConfigService: AppConfigService,
    private releaseNotesService: ReleaseNotesService,
    private dialog: MatDialog
  ) { }
  recipes$ = this.grocyService.getRecipes();

  isAppConfigured$ = this.appConfigService.isAppConfigured$;
  mealPlanSections$ = this.grocyService.getMealPlanSections();
  refreshMealPlan$ = new Subject<void>();

  selectedMealPlanSection: number | null = localStorage.getItem(
    'selectedMealPlanSection'
  )
    ? Number(localStorage.getItem('selectedMealPlanSection'))
    : null;

  appConfig = this.appConfigService.getConfig();

  grocyInfo$ = this.grocyService.grocySystemInfo$;

  currentWeek: number | undefined = dayjs().week();

  draggable = {
    effectAllowed: 'all',
    disable: false,
    handle: false,
  };

  selectSection(sectionId: number) {
    localStorage.setItem('selectedMealPlanSection', sectionId.toString());
    this.selectedMealPlanSection = sectionId;
  }

  mealPlan$ = this.grocyService.getMealPlan();

  recipeSearch: string | null = null;

  ngOnInit() {
    if (this.currentWeek === undefined) {
      const queryWeek = parseInt(
        this.route.snapshot.queryParamMap.get('week') ?? ''
      );
      this.currentWeek = queryWeek || dayjs().week();
    }
    this.refreshMealPlan$.next();
    
    // Check for new version and show release notes
    this.checkForReleaseNotes();
  }

  private checkForReleaseNotes(): void {
    this.releaseNotesService.shouldShowReleaseNotes().subscribe(shouldShow => {
      if (shouldShow) {
        this.releaseNotesService.versionInfo$.subscribe(versionInfo => {
          if (versionInfo.releaseNotes && versionInfo.hasUpdate) {
            this.showReleaseNotesModal(versionInfo.releaseNotes, versionInfo.current);
          }
        });
      }
    });
  }

  private showReleaseNotesModal(releaseNote: any, version: string): void {
    const dialogRef = this.dialog.open(ReleaseNotesModalComponent, {
      maxWidth: '95vw',
      maxHeight: '95vh',
      disableClose: false,
      panelClass: 'release-notes-dialog',
      data: {
        releaseNote,
        version
      }
    });

    // Optional: Do something when modal is closed
    dialogRef.afterClosed().subscribe(() => {
      console.log('Release notes modal was closed');
    });
  }

  changeWeek(week: number) {
    if (this.currentWeek) {
      this.currentWeek = week === 0 ? dayjs().week() : this.currentWeek + week;
    }
  }

  onDragover(event: DragEvent, day: Date) {
    // const elements = document.querySelectorAll(".dropzone.bg-blue-200");
    // elements.forEach(element => {
    //   this.renderer2.removeClass(element, 'bg-blue-200');
    // })
    // this.renderer2.addClass(event.target, 'bg-blue-200');
    // console.log("dragover", event);
  }

  resetConfig() {
    this.appConfigService.resetConfig();
  }

  onDrop(event: DndDropEvent, day: Date) {
    const dragData: RecipeDragData = event.data;
    const eventRecipe: Recipe = dragData.recipe;
    const stringDate = dayjs(day).format('YYYY-MM-DD');

    if (dragData.meal && !event.event.shiftKey) {
      this.grocyService
        .updateMeal({
          id: dragData.meal.id,
          day: stringDate,
        })
        .subscribe();
    } else {
      const meal: Partial<Meal> = {
        day: stringDate,
        recipe_id: eventRecipe.id,
        recipe_servings: 4,
        section_id: (this.selectedMealPlanSection ?? -1).toString(),
        type: 'recipe',
      };
      this.grocyService.postMeal(meal).subscribe((data) => {
        meal.id = parseInt(data.created_object_id);
        this.refreshMealPlan$.next();
      });
    }
  }
}
