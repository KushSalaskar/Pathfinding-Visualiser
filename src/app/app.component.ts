import { Component } from '@angular/core';
import { GridComponent } from './Components/grid/grid.component';
import { NodeComponent } from './Components/node/node.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PathfindingVisual';
}
