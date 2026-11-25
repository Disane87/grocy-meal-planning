import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { BehaviorSubject, switchMap, combineLatest, shareReplay, map } from 'rxjs';

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
import { HotToastService } from '@ngxpert/hot-toast';
import { TranslocoService } from '@jsverse/transloco';
import { take, takeUntil } from 'rxjs';
import { PlanRecipeSheetComponent } from './_components/plan-recipe-sheet/plan-recipe-sheet.component';
import { NO_SECTION_ID, initialDay, shiftDay } from './services/meal-plan-view';
import { SettingsPanelComponent } from './_components/settings-panel/settings-panel.component';
import { MobileTab } from './_components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class AppComponent implements OnInit {
  constructor(
    private grocyService: GrocyService,
    private route: ActivatedRoute,
    private appConfigService: AppConfigService,
    private releaseNotesService: ReleaseNotesService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private toast: HotToastService,
    private transloco: TranslocoService
  ) { }
  private refreshRecipes$ = new BehaviorSubject<void>(undefined);
  recipes$ = this.refreshRecipes$.pipe(switchMap(() => {
    this.grocyService.invalidateRecipesCache();
    return this.grocyService.getRecipes();
  }));

  isAppConfigured$ = this.appConfigService.isAppConfigured$;
  mealPlanSections$ = this.grocyService.getMealPlanSections().pipe(shareReplay({ bufferSize: 1, refCount: true }));

  selectedMealPlanSection: number | null = localStorage.getItem(
    'selectedMealPlanSection'
  )
    ? Number(localStorage.getItem('selectedMealPlanSection'))
    : null;

  appConfig = this.appConfigService.getConfig();

  grocyInfo$ = this.grocyService.grocySystemInfo$;

  currentWeekStart: dayjs.Dayjs = dayjs().startOf('isoWeek');

  isDesktop = toSignal(
    inject(BreakpointObserver).observe('(min-width: 768px)').pipe(map(r => r.matches)),
    { requireSync: true }
  );
  mobileTab: MobileTab = 'plan';
  selectedDay: dayjs.Dayjs = initialDay(this.currentWeekStart);

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
      this.selectedDay = initialDay(this.currentWeekStart);
    }
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
    this.dialog.open(ReleaseNotesModalComponent, {
      maxWidth: '95vw',
      maxHeight: '95vh',
      disableClose: false,
      panelClass: 'release-notes-dialog',
      data: {
        releaseNote,
        version
      }
    });

  }

  changeWeek(weekOffset: number) {
    if (weekOffset === 0) {
      this.currentWeekStart = dayjs().startOf('isoWeek');
    } else {
      this.currentWeekStart = this.currentWeekStart.add(weekOffset, 'week');
    }
    this.selectedDay = initialDay(this.currentWeekStart);
  }

  selectDay(day: dayjs.Dayjs) {
    this.selectedDay = day;
  }

  shiftSelectedDay(delta: 1 | -1) {
    const { day, weekOffset } = shiftDay(this.selectedDay, delta, this.currentWeekStart);
    if (weekOffset !== 0) this.changeWeek(weekOffset);
    // after changeWeek, which reset the day to its default
    this.selectedDay = day;
  }

  get currentWeek(): number {
    return this.currentWeekStart.isoWeek();
  }

  openSettings() {
    const ref = this.dialog.open(SettingsPanelComponent, {
      position: { right: '0' },
      height: '100vh',
      width: '400px',
      maxWidth: '100vw',
      panelClass: 'settings-panel-dialog',
    });
    ref.componentInstance.resetConfig.subscribe(() => { ref.close(); this.resetConfig(); });
    ref.componentInstance.showReleaseNotes.subscribe(() => this.showReleaseNotes());
    this.grocyInfo$.pipe(takeUntil(ref.afterClosed())).subscribe(info => ref.componentRef?.setInput('grocyInfo', info));
  }

  showReleaseNotes() {
    const version = this.releaseNotesService.versionInfo$.pipe(take(1));
    version.subscribe(async ({ current }) => {
      const note = await this.releaseNotesService.loadReleaseNotes(current);
      if (note) this.showReleaseNotesModal(note, current);
      else this.toast.info(this.transloco.translate('NO_RELEASE_NOTES'));
    });
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
    this.grocyService.postMeal(meal).subscribe();
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
