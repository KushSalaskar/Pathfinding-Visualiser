import { Component, OnInit, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { NodeComponent } from "../node/node.component"
import { Node, Point } from "../../Interfaces/node"
import { MessageServiceService } from "../../Services/message-service.service"

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  rows:number = 25
  cols:number = 50
  isClicked: boolean = false

  startNode:Point = {row:10, col:14}
  endNode:Point = {row:10, col:44}
  nodes: Array<Array<Node>> = []

  @ViewChildren('node') mycomponents: QueryList<any>

  constructor(
    private ref: ChangeDetectorRef,
    private messageService: MessageServiceService
  ) { 
    this.CreateNodes()
    this.InitializeStartEndNodes();
  }

  ngOnInit(): void {
  }

  InitializeStartEndNodes() {
    this.startNode = { row: 10, col: 14 };
    this.endNode = { row: 8, col: 44 };
    let stNd: Node = this.getNode(this.startNode);
    stNd.isStartNode = true;
    this.startNode = stNd;
    let enNd = this.getNode(this.endNode);
    enNd.isEndNode = true;
    this.endNode = enNd;
  }


  CreateNodes(){
    for(let i=0; i<this.rows; i++){
      const cols: Array<Node> = []
      for(let j=0; j<this.cols; j++){
        cols.push(new Node(i, j, false, false, this.startNode, this.endNode))
      }
      this.nodes.push(cols)
    }
  }


  Drop(event) {
    let previousNode: Node = event.previousNode;
    let newNode: Node = event.newNode;
    console.log(previousNode, this.endNode);
    //handle if the node was startnode
    if (previousNode.isStartNode && !newNode.isEndNode) {
      console.log(previousNode, this.endNode);
      let { row, col } = previousNode;
      this.nodes[row][col].isStartNode = false;
      previousNode.isStartNode = false;
      this.nodes[newNode.row][newNode.col].isStartNode = true;
      this.startNode = this.nodes[newNode.row][newNode.col];

      //handle of the node was endNode
    } else if (previousNode.isEndNode && !newNode.isStartNode) {
      let { row, col } = previousNode;
      this.nodes[row][col].isEndNode = false;
      previousNode.isEndNode = false;
      this.nodes[newNode.row][newNode.col].isEndNode = true;
      this.endNode = this.nodes[newNode.row][newNode.col];
    }

    // [2D => 1D] -> index =  row * totalelemsInRow + Col;
    // this.RunChangeDetector('single' , previousNode.row * this.cols + previousNode.col  );
    // this.RunChangeDetector('single' , newNode.row * this.cols + newNode.col  );
    console.log('here');
    //this.RunChangeDetector();
  }


  getNode(point): Node {
    for (const row of this.nodes) {
      for (const node of row) {
        if (node.row === point.row && node.col === point.col) {
          return node;
        }
      }
    }
  }

  MouseUp(event: Event){
    this.messageService.MouseRelease()
    event.preventDefault()
    event.stopPropagation()
  }

  MouseDown(event: Event){
    this.messageService.MouseClicked()
    event.preventDefault()
    event.stopPropagation()
  }

}
