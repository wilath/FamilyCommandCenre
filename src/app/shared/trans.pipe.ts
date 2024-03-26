import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../model/task';
import { Subject } from 'rxjs';

@Pipe({
  name: 'donePipe',
  pure: true,
})
export class TransPipe implements PipeTransform {
  transform(task: Array<Task>, done: boolean, change: number) {
    return task.filter((e) => e.isDone === done);
  }
}
