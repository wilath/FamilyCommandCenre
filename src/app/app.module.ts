import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddtaskComponent } from './components/addtask/addtask.component';
import { ListComponent } from './components/list/list.component';
import { TasksService } from './services/tasks.service';
import { TransPipe } from './shared/trans.pipe';
import { SortPipe } from './shared/sort.pipe';
import { MemberSort } from './shared/memberSort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    AppComponent,
    AddtaskComponent,
    ListComponent,
    TransPipe,
    SortPipe,
    MemberSort
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule, 
    DragDropModule,
    FlexLayoutModule
  ],
  providers: [TasksService],
  bootstrap: [AppComponent]
})
export class AppModule { }
