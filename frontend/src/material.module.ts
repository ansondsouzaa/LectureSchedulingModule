import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"; 

@NgModule({
  exports: [
    MatButtonToggleModule,
    MatDatepickerModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSortModule,
    MatProgressSpinnerModule,
  ],
})
export class MaterialModule {}
