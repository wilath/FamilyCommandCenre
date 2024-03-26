import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../model/task';
import { Member } from '../model/member';
import { NgForm } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class TasksService {
  
  constructor() {
   const taskList: Array<Task> = [
      {id: 528, name: 'Water Plants', created: new Date('2023-04-23 18:10:53'), isDone: false, member: 'John', assignedBy: 'Daphne', importance: 'normal', deadline: new Date('2023-05-23 18:10:53') },
      {id: 529, name: 'Walk the dog', created: new Date('2023-03-22 17:10:10'), isDone: false, member: 'Mark', assignedBy: 'Daphne', importance: 'low', deadline: new Date('2023-05-23 18:10:53')   },
      {id: 530, name: 'Grocery shopping', created: new Date('2024-07-21 20:05:55'), isDone: false, member: 'Mark', assignedBy: 'Mark',  importance: 'high', deadline: new Date('2023-05-23 18:10:53')   },
      {id: 531, name: 'Change sheets', created: new Date('2023-02-21 03:29:11'), isDone: false, member: 'Daphne', assignedBy: 'Mark', importance: 'high', deadline: new Date('2023-05-23 18:10:53')   },
      {id: 532, name: 'Learn Angular', created: new Date('2023-04-23 15:11:11'), isDone: false, member: 'Daphne',assignedBy: 'Daphne', importance: 'normal', deadline: new Date('2023-05-23 18:10:53')   },
      {id: 533, name: 'Clean the kitchen', created: new Date('2023-03-21 13:19:14'), end: new Date('2022-07-25 18:29:41'), isDone: true, member: 'Julian', assignedBy: 'Mark', importance: 'low', deadline: new Date('2023-05-23 18:10:53')  },
      {id: 534, name: 'Laundry', created: new Date('2023-02-05 05:21:57'), end: new Date('2022-07-25 18:54:11'), isDone: true, member: 'Julian',assignedBy: 'Mark', importance: 'low', deadline: new Date('2023-05-23 18:10:53')},
      {id: 526, name: 'Wash the car', created: new Date('2023-02-04 01:21:54'),  isDone: false, member: 'John',assignedBy: 'John', importance: 'low', deadline: new Date('2023-05-23 18:10:53')},
      {id: 525, name: 'Wrap presents', created: new Date('2023-02-03 04:11:57'), isDone: false, member: 'Julian',assignedBy: 'John', importance: 'low', deadline: new Date('2023-05-23 18:10:53')},
      {id: 527, name: 'Clean the fireplace', created: new Date('2023-02-04 05:11:17'), isDone: false, member: 'Julian',assignedBy: 'Mark', importance: 'normal', deadline: new Date('2023-05-23 18:10:53')}
    ]
    const members: Array<Member> = [
      {name: 'John', class: 'Adult', color: 'var(--fandango)'},
      {name: 'Daphne', class: 'Adult', color: 'var(--thulian-pink)'},
      {name: 'Mark', class: 'Child', color: 'var(--dutch-white)'},
      {name: 'Julian', class: 'Child', color: 'var(--ice-blue)'},
    ]
   
  
    const storedHistory = localStorage.getItem('history')
    const storedMembers = localStorage.getItem('members')
    const storedTasks = localStorage.getItem('tasks')

    if (storedHistory && storedMembers && storedTasks) {
      this.history$.next(JSON.parse(storedHistory))
      this.memberList$.next(JSON.parse(storedMembers))
      this.taskList$.next(JSON.parse(storedTasks))
    } else {
      this.memberList$.next(members)
      this.taskList$.next(taskList);
      for(let i = 0; i < taskList.length ; i++){
        this.addTaskToHistory(taskList[i], 'add')
      }
      
      localStorage.setItem("members", JSON.stringify(members));
      localStorage.setItem("tasks", JSON.stringify(taskList));
      localStorage.setItem("history", JSON.stringify(this.history$.getValue()));
    }
   
  }

  private taskList$ = new BehaviorSubject<Array<Task>>([]);

  private memberList$ = new BehaviorSubject<Array<Member>>([]);

  private history$ = new BehaviorSubject<Array<string>>([]);

  public activeMember: string = ''


  public add(task: Task): void {
    const list = this.taskList$.getValue();
    list.push(task)
    this.taskList$.next(list);
    localStorage.setItem("tasks", JSON.stringify(list));
    this.addTaskToHistory(task, 'add')
  }
  
  public addMember(member: Member){
    const mem = this.memberList$.getValue()
    mem.push(member)
    this.memberList$.next(mem)
    localStorage.setItem('members', JSON.stringify(mem))
    this.addMemberToHistory(member, 'add')
  }

  public deleteMember(member:string, active:string){
    var list = this.taskList$.getValue()
    var mems = this.memberList$.getValue()
    const index = mems.findIndex(e => e.name === active)

    if(member === 'delete'){
      list = list.filter((e)=> e.member !== active);
      this.taskList$.next(list)
      localStorage.setItem("tasks", JSON.stringify(list));

    } else {
      list = list.map(item => {
        if (item.member === active) {
          return { ...item, member: member };
        } else {
          return item;
        }
      });
      this.taskList$.next(list)
      localStorage.setItem("tasks", JSON.stringify(list));
    }

    this.addMemberToHistory(mems[index], 'delete')
    mems.splice(index,1)
    localStorage.setItem('members', JSON.stringify(mems))
   
  }

  public done(task: Task) {
    task.end = new Date();
    task.isDone = true;
    var list = this.taskList$.getValue();
    this.taskList$.next(list);
    localStorage.setItem("tasks", JSON.stringify(list));
    this.addTaskToHistory(task, 'done')
  }

  public undone(task: Task){
    task.isDone = false;
    delete task.end
    let list = this.taskList$.getValue();
    this.taskList$.next(list)
    localStorage.setItem("tasks", JSON.stringify(list));
    this.addTaskToHistory(task, 'undone')
    
  }

  public editTask(task:NgForm, id:number){
    var list = this.taskList$.getValue()

    const index = list.findIndex(e => e.id === id)

    if (index !== -1) {
      list[index].name = task.value.name
      list[index].deadline = task.value.deadline
      list[index].assignedBy = task.value.for
      list[index].importance = task.value.urgent;
      list[index].created = task.value.created;
      if(task.value.member){
      list[index].member = task.value.member
      }
    }

    this.taskList$.next(list)
    localStorage.setItem("tasks", JSON.stringify(list));
    this.addTaskToHistory(list[index], 'edit')
  }

  public dropTask(id:number, newMember:string){
    var list = this.taskList$.getValue()
    const index = list.findIndex(e => e.id === id)
    if(newMember !== list[index].member){
      if(index !== -1){
        list[index].member = newMember
      }
      this.taskList$.next(list)
      localStorage.setItem("tasks", JSON.stringify(list));
      this.addTaskToHistory(list[index], 'edit')
    }
    
  }

  public remove(task: Task) {
    var list = this.taskList$.getValue();
    list = list.filter(e => e !== task);
    this.taskList$.next(list);
    localStorage.setItem("tasks", JSON.stringify(list));
  }

  public deleteall() {
    var list = this.taskList$.getValue();
    list = [];
    this.taskList$.next(list);
  }

  public getTaskListObs(): Observable<Array<Task>> {
    return this.taskList$.asObservable();
  }

  public getMemberListObs(): Observable<Array<Member>>{
    return this.memberList$.asObservable();
  }

  public getHistoryListObs(): Observable<Array<string>>{
    return this.history$.asObservable();
  }

  public addTaskToHistory(item: Task ,  action: 'add' | 'delete' | 'edit' | 'done' | 'undone' ){
     let cDate = item.created.toLocaleString()
     let aDate = new Date().toLocaleDateString()
     let eDate = item.end?.toLocaleDateString()

     let hist: Array<string> = this.history$.getValue();
     let task: string = ''
     
   
        switch (action){
          case 'add':                  
           task =  cDate  + ' - ' +  item.assignedBy + ' added new task: ' + item.name + '(' + item.id + ')';
          break;
          case 'delete':            
           task = aDate  + ' - ' +  this.activeMember + ' deleted task: ' + item.name + '(' + item.id + ')';
          break;
          case 'edit':        
          task = aDate  + ' - ' +  this.activeMember + ' edited task: ' + item.name + '(' + item.id + ')';
          break;
          case 'done':           
          task = eDate  + ' - ' +  item.member + ' finished task: ' + item.name + '(' + item.id + ')';
          break;
          case 'undone':           
          task = aDate  + ' - ' +  this.activeMember + ' undone task: ' + item.name + '(' + item.id + ')';
          break;
          
        }
      hist.push(task)
      this.history$.next(hist)
      localStorage.setItem('history', JSON.stringify(hist))
      
    }

  public addMemberToHistory(item: Member, action: 'add' | 'edit' | 'delete'){
    let date = new Date().toLocaleDateString();
    let hist: Array<string> = this.history$.getValue();
    let task: string = '';
    switch (action){
      case 'add':                  
       task =  date  + ' - ' +  this.activeMember  + ' added new member: ' + item.name
      break;
      case 'delete':            
       task = date  + ' - ' +  this.activeMember + ' deleted member: ' + item.name
      break;
      case 'edit':        
      task = date  + ' - ' +  this.activeMember + ' edited member: ' + item.name 
      break;  
    }
    hist.push(task)
    this.history$.next(hist)
    localStorage.setItem('history', JSON.stringify(hist))
  }
}




