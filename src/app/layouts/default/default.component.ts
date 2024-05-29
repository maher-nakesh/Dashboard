import { Component } from '@angular/core';


@Component({
  selector: 'app-unique-default',
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss'
})

export class DefaultComponent {
  sideBarOpen=true;
  sideBarToggler(event:any) {
    this.sideBarOpen=!this.sideBarOpen;
  }


}
