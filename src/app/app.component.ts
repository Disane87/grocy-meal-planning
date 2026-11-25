import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Subject, BehaviorSubject, switchMap, combineLatest } from 'rxjs';

dayjs.extend(isoWeek);

import { GrocyService } from './grocy.service';
import { Meal } from './interfaces/meal.interface';
import { Recipe } from './interfaces/recipe.interface';
import { RecipeDragData } from './interfaces/recipe-drag-data.interface';
import { DndDropEvent } from 'ngx-drag-drop';
import { AppConfigService } from './appconfig.service';
import { ReleaseNotesService } from './services/release-notes.service';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ReleaseNotesModalComponent } from './_components/release-notes-modal/release-notes-modal.component';
import { RecipePickerSheetComponent } from './_components/recipe-picker-sheet/recipe-picker-sheet.component';
import { RecipeImportDialogComponent } from './_components/recipe-import-dialog/recipe-import-dialog.component';
import { take } from 'rxjs';
import { PlanRecipeSheetComponent } from './_components/plan-recipe-sheet/plan-recipe-sheet.component';
import { NO_SECTION_ID } from './services/meal-plan-view';

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
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet
  ) { }
  private refreshRecipes$ = new BehaviorSubject<void>(undefined);
  recipes$ = this.refreshRecipes$.pipe(switchMap(() => {
    this.grocyService.invalidateRecipesCache();
    return this.grocyService.getRecipes();
  }));

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

  currentWeekStart: dayjs.Dayjs = dayjs().startOf('isoWeek');

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
    const queryWeek = this.route.snapshot.queryParamMap.get('week');
    if (queryWeek) {
      const weekNum = parseInt(queryWeek);
      this.currentWeekStart = dayjs().isoWeek(weekNum).startOf('isoWeek');
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

  changeWeek(weekOffset: number) {
    if (weekOffset === 0) {
      this.currentWeekStart = dayjs().startOf('isoWeek');
    } else {
      this.currentWeekStart = this.currentWeekStart.add(weekOffset, 'week');
    }
  }

  get currentWeek(): number {
    return this.currentWeekStart.isoWeek();
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

  onRefreshRecipes() {
    this.refreshRecipes$.next();
  }

  onImportRecipe() {
    const dialogRef = this.dialog.open(RecipeImportDialogComponent, {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '500px',
      panelClass: 'recipe-import-dialog',
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) {
        this.refreshRecipes$.next();
      }
    });
  }

  onAddRecipe(event: { day: Date; sectionId?: number }) {
    combineLatest([this.recipes$.pipe(take(1)), this.mealPlanSections$.pipe(take(1))]).subscribe(([recipes, sections]) => {
      const sheetRef = this.bottomSheet.open(RecipePickerSheetComponent, {
        data: {
          recipes,
          sections,
          sectionId: event.sectionId ?? this.selectedMealPlanSection ?? NO_SECTION_ID,
          onRefresh: () => {
            this.refreshRecipes$.next();
            this.recipes$.pipe(take(1)).subscribe(updated => {
              sheetRef.instance.recipes = updated;
            });
          }
        },
        panelClass: 'recipe-picker-bottom-sheet',
      });

      sheetRef.afterDismissed().subscribe((result: { recipe: Recipe; sectionId: number } | undefined) => {
        if (result) this.planRecipe(result.recipe, event.day, result.sectionId);
      });
    });
  }

  onPlanRecipeFromList(recipe: Recipe) {
    this.mealPlanSections$.pipe(take(1)).subscribe(sections => {
      const sheetRef = this.bottomSheet.open(PlanRecipeSheetComponent, {
        data: {
          recipe,
          weekStart: this.currentWeekStart,
          sections,
          sectionId: this.selectedMealPlanSection ?? NO_SECTION_ID,
        },
        panelClass: 'recipe-picker-bottom-sheet',
      });

      sheetRef.afterDismissed().subscribe((result: { day: Date; sectionId: number } | { openInGrocy: true } | undefined) => {
        if (!result) return;
        if ('openInGrocy' in result) this.grocyService.openGrocyRecipe(recipe.id);
        else this.planRecipe(recipe, result.day, result.sectionId);
      });
    });
  }

  planRecipe(recipe: Recipe, day: Date, sectionId: number) {
    this.selectSection(sectionId);
    const meal: Partial<Meal> = {
      day: dayjs(day).format('YYYY-MM-DD'),
      recipe_id: recipe.id,
      recipe_servings: 4,
      section_id: String(sectionId),
      type: 'recipe',
    };
    this.grocyService.postMeal(meal).subscribe(() => this.refreshMealPlan$.next());
  }

  moveMeal(mealId: number, day: Date, sectionId: number) {
    this.grocyService
      .updateMeal({ id: mealId, day: dayjs(day).format('YYYY-MM-DD'), section_id: String(sectionId) })
      .subscribe();
  }

  onDrop(event: DndDropEvent, day: Date, sectionId: number) {
    const dragData: RecipeDragData = event.data;
    if (dragData.meal && !event.event.shiftKey) this.moveMeal(dragData.meal.id, day, sectionId);
    else this.planRecipe(dragData.recipe, day, sectionId);
  }
}
