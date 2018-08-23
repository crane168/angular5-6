import {Component, ElementRef, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-checkbox',
  encapsulation: ViewEncapsulation.None,
  styles: [],
  template: `
    <ng-container *mobxAutorun="{dontDetach: true}">
      <input
              #checkbox
        class="tree-node-checkbox"
        type="checkbox"
        (click)="selectCheckBox($event)"
        [checked]="node.isSelected || node.checked"
        [indeterminate]="node.isPartiallySelected"/>
    </ng-container>
  `
})
export class TreeNodeCheckboxComponent {
    @ViewChild('checkbox') checkbox: ElementRef;
  @Input() node: TreeNode;

  /*michael xiao add*/
  protected selectCheckBox($event){
      this.node.data.checked=this.checkbox.nativeElement.checked;
      this.node.mouseAction('checkboxClick', $event);
  }

}
