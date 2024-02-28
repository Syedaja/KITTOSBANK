import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('collapsed', style({ opacity: 0, height: '0' })),
      state('expanded', style({ opacity: 1, height: '*' })),
      transition('collapsed => expanded', animate('300ms ease-in')),
      transition('expanded => collapsed', animate('300ms ease-out'))
    ])
  ]
})
export class ContentComponent {
  // read more content
  expanded = false;

  toggleReadMore() {
    this.expanded = !this.expanded;
  }
  // another FAQ

}
