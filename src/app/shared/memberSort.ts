import { Pipe, PipeTransform } from '@angular/core';

import { Task } from '../model/task';

@Pipe({
  name: 'memberSort',
  pure: true,
})
export class MemberSort implements PipeTransform {
  transform(value: Array<Task>, arg1: string, change: number): any {
    return value.filter((e) => e.member === arg1);
  }
}
