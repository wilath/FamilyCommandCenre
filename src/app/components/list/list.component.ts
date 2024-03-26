import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { NgForm } from '@angular/forms';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TasksService } from '../../services/tasks.service';
import { Member } from '../../model/member';
import { Task } from '../../model/task';

interface sortInfo {
  show: boolean;
  sort: boolean;
  dir: boolean;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  constructor(
    private tasksService: TasksService,
    private breakpointObserver: BreakpointObserver
  ) {}

  public tasklist: Array<Task> = [];

  public memberList: Array<Member> = [];

  public showDones: Array<sortInfo> = [];

  public pipeChangeDetection: number = 0;

  public onEdit: number = 0;

  public docWidth = window.innerWidth;

  public isSmallScreen: boolean = false;

  public onDeleteMember: string = '';

  public ngOnInit(): void {
    this.setData()
    this.setResponsiveObserver()
  }

  public onRemoveTask (task: Task) {
    this.tasksService.remove(task);
    this.tasksService.addTaskToHistory(task, 'delete');
    this.activatePipe();
  }

  public onDoneTask (task: Task) {
    this.tasksService.done(task);
    this.activatePipe();
  }
  
  public startEdit (task: number) {
    if (this.onEdit === 0) {
      this.onEdit = task;
    } else {
      setTimeout(() => {
        this.onEdit = 0;
      }, 0);
    }
  }

  public onCancelEdit (task: Task) {
    this.onEdit = 0;
  }

  public onUndoneTask (task: Task) {
    this.tasksService.undone(task);
    this.activatePipe();
  }

  public onEditTask (task: NgForm) {
    this.startEdit(task.value.id);
    this.tasksService.editTask(task, this.onEdit);
  }

  public drop (e: CdkDragDrop<any>) {
    let taskId = e.item.data;
    let newOwner = e.container.data;
    this.tasksService.dropTask(taskId, newOwner);
  }

  public terminateMember (del: NgForm, active: string) {
    let name = del.value.reasign;

    this.tasksService.deleteMember(name, active);
    setTimeout(() => {
      this.onDeleteMember = '';
    }, 50);
  }

  public switchView (n: number, i: number): void {
    switch (n) {
      case 0:
        this.showDones[i].show = !this.showDones[i].show;

        break;
      case 1:
        this.showDones[i].sort = !this.showDones[i].sort;
        break;
      case 2:
        this.showDones[i].dir = !this.showDones[i].dir;
        break;
    }
  }

  private activatePipe (): void {
    this.pipeChangeDetection = Math.random();
  }

  private createSorts (mems: any) {
    for (const mem of mems) {
      this.showDones.push({ show: false, sort: false, dir: false });
    }
  }

  private setResponsiveObserver (): void {
    this.breakpointObserver
    .observe(['(max-width: 1350px)'])
    .subscribe((result) => {
      this.isSmallScreen = result.matches;
    });
  }
  
  private setData (): void {
    this.tasksService
    .getTaskListObs()
    .pipe(
      tap(() => {
        this.activatePipe();
      })
    )
    .subscribe((tasks: Array<Task>) => (this.tasklist = tasks));
  this.tasksService
    .getMemberListObs()
    .pipe(
      tap((mem) => {
        this.createSorts(mem);
      })
    )
    .subscribe((members: Array<Member>) => (this.memberList = members));
  this.createSorts(this.memberList);
  }
}
