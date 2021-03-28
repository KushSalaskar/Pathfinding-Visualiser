import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './Components/grid/grid.component';
import { NodeComponent } from './Components/node/node.component';
import { DijkstraAlgoService } from './Algorithms/dijkstra-algo.service'

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    NodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [DijkstraAlgoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
