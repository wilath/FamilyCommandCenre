import { Component, OnInit, } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TasksService } from '../../services/tasks.service';
import { Member } from '../../model/member';
import { Task } from '../../model/task';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.css'] ,
  
})
export class AddtaskComponent implements OnInit {

  constructor(private tasksService: TasksService){}

  public members: Array<Member> =[];

  public whatDo: 'Task' | 'Member' = 'Task';

  public editor: string = '';

  public currentNumber: number = 534;

  public newMemberColor:string = ''

  public history: Array<string> = []

  public ngOnInit(): void {
    this.setData()
    if(this.members.length > 0){
      this.editor = this.members[0].name;
      this.tasksService.activeMember = this.editor
    }
  }

  public editorChange(){
    this.tasksService.activeMember = this.editor
  }

  public changeOption(el:string): void{
    if(el === this.whatDo){return}

    if(this.whatDo === 'Task'){
      this.whatDo = 'Member'
    }else{
      this.whatDo = 'Task'
    }

    const butts = document.querySelectorAll('.opt-but');

    if(this.whatDo === 'Task'){
      butts[0].classList.add('but-active');
      butts[1].classList.remove('but-active');
    }else{
      butts[1].classList.add('but-active');
      butts[0].classList.remove('but-active');
      }
     
  }

  public onSubmitTask(form: NgForm): void{
    
    const task: Task = ({
      id: this.currentNumber + 1,
      name: form.value.name,
      created: new Date(),
      isDone: false,
      member: form.value.for,
      assignedBy: this.editor,
      importance: form.value.urgent,
      deadline: form.value.deadline
      
    
    })
    this.currentNumber++
    this.tasksService.add(task);
  }

  public onSubmitMember(form: NgForm): void{
    if(this.members.length === 6){
      return
    }
    const member: Member = ({
      name: form.value.name,
      class: form.value.class,
      color: this.newMemberColor,
    })
    this.tasksService.addMember(member)
  }

  public colorPick(e:string, n: number): void{
    const colors =document.querySelectorAll('.color-button');
    for(let i = 0; i < 5; i++){
      colors[i].classList.remove('cb-border')
    }
    colors[n].classList.add('cb-border');
    this.newMemberColor = e;
  }

  private setData(): void {
    this.tasksService.getMemberListObs().subscribe((members: Array<Member>) => this.members = members);
    this.tasksService.getHistoryListObs().subscribe((e)=> this.history = [...e].reverse());   
  }
}

