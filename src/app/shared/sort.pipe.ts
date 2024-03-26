import { Pipe, PipeTransform } from '@angular/core';
import { concat } from 'rxjs';
import { Task } from '../model/task';

@Pipe({
  name: 'sort',
  pure: true,
})
export class SortPipe implements PipeTransform {
  transform(value: Array<Task>, arg1: boolean, arg2: boolean, change: number) {
    switch (arg1 + ' ' + arg2) {
      case 'false false':
        return value.sort((a, b) => {
          if (a.created > b.created) {
            return 1;
          } else {
            return -1;
          }
        });
        break;
      case 'false true':
        return value.sort((a, b) => {
          if (a.created < b.created) {
            return 1;
          } else {
            return -1;
          }
        });
        break;
      case 'true false':
        return value.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          } else {
            return -1;
          }
        });
        break;
      case 'true true':
        return value.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return 1;
          } else {
            return -1;
          }
        });
        break;
      default:
        return;
        break;
    }
  }
}
