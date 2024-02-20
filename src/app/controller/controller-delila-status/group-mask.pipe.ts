import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "groupMask",
  standalone: true,
})
export class GroupMaskPipe implements PipeTransform {
  transform(value: string): string {
    let position = value.indexOf(":");
    return value.slice(position + 1, value.length - 1);
  }
}
