import { Component, OnInit, ViewChildren, QueryList, ChangeDetectorRef, HostListener } from '@angular/core';
import { NodeComponent } from "../node/node.component"
import { Node, Point } from "../../Interfaces/node"
import { MessageServiceService } from "../../Services/message-service.service"
import { DijkstraAlgoService } from "../../Algorithms/dijkstra-algo.service"
import { AstarAlgoService } from "../../Algorithms/astar-algo.service"
import { DFSAlgoService } from "../../Algorithms/dfs-algo.service"
import { BidirectionalSwarmAlgoService } from "../../Algorithms/bidirectional-swarm-algo.service"

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  rows:number = 17
  cols:number = 40

  startNode:Point = {row:10, col:4}
  endNode:Point = {row:10, col:24}
  nodes: Array<Array<Node>> = []

  @ViewChildren('node') mycomponents: QueryList<any>

  constructor(
    private ref: ChangeDetectorRef,
    public messageService: MessageServiceService
  ) { 
    this.CreateNodes()
    this.InitializeStartEndNodes()
    // this.openModal()
  }

  ngOnInit(): void {
    this.openModal()
  }


  openModal(){
    document.getElementById("modal").style.display = "block"
    document.body.classList.add('jw-modal-open')
  }

  closeModal(){
    document.getElementById("modal").style.display = "none"
    document.body.classList.remove('jw-modal-open')
  }


  InitializeStartEndNodes() {
    this.startNode = { row: 10, col: 4 }
    this.endNode = { row: 10, col: 24 }
    let stNd: Node = this.getNode(this.startNode)
    stNd.isStartNode = true
    this.startNode = stNd
    let enNd = this.getNode(this.endNode)
    enNd.isEndNode = true
    this.endNode = enNd
  }


  CreateNodes(){
    for(let i=0; i<this.rows; i++){
      const cols: Array<Node> = []
      for(let j=0; j<this.cols; j++){
        cols.push(new Node(i, j, false, false, false, false, false, false, this.startNode, this.endNode))
      }
      this.nodes.push(cols)
    }
  }


  Drop(event) {
    let previousNode: Node = event.previousNode
    let newNode: Node = event.newNode
    if (previousNode.isStartNode && !newNode.isEndNode && this.messageService.GetAnimationInfo() === "Null") {
      let { row, col } = previousNode
      this.nodes[row][col].isStartNode = false
      previousNode.isStartNode = false
      this.nodes[newNode.row][newNode.col].isStartNode = true
      this.startNode = this.nodes[newNode.row][newNode.col]
    } 
    if (previousNode.isEndNode && !newNode.isStartNode) {
      let { row, col } = previousNode
      this.nodes[row][col].isEndNode = false
      previousNode.isEndNode = false
      this.nodes[newNode.row][newNode.col].isEndNode = true
      this.endNode = this.nodes[newNode.row][newNode.col]
    }
    this.RunChangeDetector()
    if(this.messageService.GetAnimationInfo() === "Dijkstras"){
      this.rerenderDijkstras()
    }
    if(this.messageService.GetAnimationInfo() === "Astar"){
      this.rerenderAstar()
    }
    if(this.messageService.GetAnimationInfo() === "DFS"){
      this.rerenderDFS()
    }
    // if(this.messageService.GetAnimationInfo() === "Bidirectional"){
    //   this.rerenderBidirectionalSwarm()
    // }
    
  }


  getNode(point): Node {
    for (const row of this.nodes) {
      for (const node of row) {
        if (node.row === point.row && node.col === point.col) {
          return node
        }
      }
    }
  }


  Reset(event: Event){
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.nodes[i][j].reset()
      }
    }
    let newNodes = [];
    for (let i = 0; i < this.rows; i++) {
      newNodes.push([...this.nodes[i]])
    }
    this.nodes = newNodes
    this.InitializeStartEndNodes()
    this.messageService.ResetAnimationInfo()
    this.messageService.ResetAnimationOnBoard()
    this.RunChangeDetector()
  }

  ClearPath(event: Event){
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.nodes[i][j].isWall = this.nodes[i][j].isWall
        this.nodes[i][j].isVisitedAnimation = false
        this.nodes[i][j].isVisited = false
        this.nodes[i][j].inPath = false
        this.nodes[i][j].isPathAnimation = false
        this.nodes[i][j].rerenderWithoutAnimation = false
        this.nodes[i][j].rerenderPathWithoutAnimation = false
        this.nodes[i][j].distance = Infinity
        this.nodes[i][j].totalDistance = Infinity
        this.nodes[i][j].endNodeDistance = Infinity
        this.nodes[i][j].heuristicDistance = null
        this.nodes[i][j].isEndNode = this.nodes[i][j].isEndNode
        this.nodes[i][j].isStartNode = this.nodes[i][j].isStartNode
        this.nodes[i][j].isMiddleNode = false
      }
    }
    let newNodes = [];
    for (let i = 0; i < this.rows; i++) {
      newNodes.push([...this.nodes[i]])
    }
    this.nodes = newNodes
    this.messageService.ResetAnimationInfo()
    this.messageService.ResetAnimationOnBoard()
    this.RunChangeDetector()
  }

  ClearWallsAndPath(event: Event){
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.nodes[i][j].isWall = false
        this.nodes[i][j].isVisitedAnimation = false
        this.nodes[i][j].isVisited = false
        this.nodes[i][j].inPath = false
        this.nodes[i][j].isPathAnimation = false
        this.nodes[i][j].rerenderWithoutAnimation = false
        this.nodes[i][j].rerenderPathWithoutAnimation = false
        this.nodes[i][j].distance = Infinity
        this.nodes[i][j].totalDistance = Infinity
        this.nodes[i][j].endNodeDistance = Infinity
        this.nodes[i][j].heuristicDistance = null
        this.nodes[i][j].isEndNode = this.nodes[i][j].isEndNode
        this.nodes[i][j].isStartNode = this.nodes[i][j].isStartNode
        this.nodes[i][j].isMiddleNode = false
      }
    }
    let newNodes = [];
    for (let i = 0; i < this.rows; i++) {
      newNodes.push([...this.nodes[i]])
    }
    this.nodes = newNodes
    this.messageService.ResetAnimationInfo()
    this.messageService.ResetAnimationOnBoard()
    this.RunChangeDetector()
  }


//-------------- Dijkstars--------------------------------------------------

  animateDijkstras(){
    this.messageService.StartAnimation()
    this.messageService.SetAnimationOnBoard()
    this.messageService.SetAnimationInfo("Dijkstras")
    const dijkstras = new DijkstraAlgoService()
    const visitedNodes = dijkstras.startAnimation(this.nodes, this.startNode, this.endNode)
    for(let i = 0; i < visitedNodes.length; i++){
      this.mycomponents.forEach((cmp: NodeComponent) => {
        if(cmp.node == visitedNodes[i]){
          setTimeout(() => {
            cmp.node.isVisitedAnimation = true
            cmp.runChangeDetector()
          }, 20*i)
        }
      })
    }
    setTimeout(() => {
      this.animateShortestPath(visitedNodes) 
    }, 20*visitedNodes.length)
  }

  rerenderDijkstras(){
    const dijkstras = new DijkstraAlgoService()
    const visitedNodes = dijkstras.startAnimation(this.nodes, this.startNode, this.endNode)
    
    this.mycomponents.forEach((cmp: NodeComponent) => {
      cmp.node.inPath = false
      cmp.node.isPathAnimation = false
      cmp.node.isVisitedAnimation = false
      cmp.node.rerenderWithoutAnimation = false
      cmp.node.rerenderPathWithoutAnimation = false
      cmp.runChangeDetector() 
    })
    
    for(let i = 0; i < visitedNodes.length; i++){
      this.mycomponents.forEach((cmp: NodeComponent) => {
        if(cmp.node == visitedNodes[i]){
          cmp.node.rerenderWithoutAnimation = true
          cmp.runChangeDetector() 
        }
      })
    }

    this.rerenderShortestPath(visitedNodes) 
  }

  //---------------------Astar----------------------------------------------------


  animateAstar(){
    this.messageService.StartAnimation()
    this.messageService.SetAnimationOnBoard()
    this.messageService.SetAnimationInfo("Astar")
    const astar = new AstarAlgoService()
    const visitedNodes = astar.startAnimation(this.nodes, this.startNode, this.endNode)
    for(let i = 0; i < visitedNodes.length; i++){
      this.mycomponents.forEach((cmp: NodeComponent) => {
        if(cmp.node == visitedNodes[i]){
            setTimeout(() => {
                cmp.node.isVisitedAnimation = true
                cmp.runChangeDetector()
            }, 20*i)
          }
      })
    }
    setTimeout(() => {
      this.animateShortestPath(visitedNodes) 
    }, 20*visitedNodes.length)
  }


  rerenderAstar(){
    const astar = new AstarAlgoService()
    const visitedNodes = astar.startAnimation(this.nodes, this.startNode, this.endNode)
    
    this.mycomponents.forEach((cmp: NodeComponent) => {
      cmp.node.inPath = false
      cmp.node.isPathAnimation = false
      cmp.node.isVisitedAnimation = false
      cmp.node.rerenderWithoutAnimation = false
      cmp.node.rerenderPathWithoutAnimation = false
      cmp.runChangeDetector() 
    })
    
    for(let i = 0; i < visitedNodes.length; i++){
      this.mycomponents.forEach((cmp: NodeComponent) => {
        if(cmp.node == visitedNodes[i]){
          cmp.node.rerenderWithoutAnimation = true
          cmp.runChangeDetector() 
        }
      })
    }

    this.rerenderShortestPath(visitedNodes) 
  }


  //---------------DFS--------------------------------------------

  animateDFS(){
    this.messageService.StartAnimation()
    this.messageService.SetAnimationOnBoard()
    this.messageService.SetAnimationInfo("DFS")
    const dfs = new DFSAlgoService()
    const visitedNodes = dfs.startAnimation(this.nodes, this.startNode, this.endNode)
    for(let i = 0; i < visitedNodes.length; i++){
      this.mycomponents.forEach((cmp: NodeComponent) => {
        if(cmp.node == visitedNodes[i]){
            setTimeout(() => {
                cmp.node.isVisitedAnimation = true
                cmp.runChangeDetector()
            }, 20*i)
          }
      })
    }
    setTimeout(() => {
      this.animateShortestPath(visitedNodes) 
    }, 20*visitedNodes.length)
  }

  rerenderDFS(){
    const dfs = new DFSAlgoService()
    const visitedNodes = dfs.startAnimation(this.nodes, this.startNode, this.endNode)
    this.mycomponents.forEach((cmp: NodeComponent) => {
      cmp.node.inPath = false
      cmp.node.isPathAnimation = false
      cmp.node.isVisitedAnimation = false
      cmp.node.rerenderWithoutAnimation = false
      cmp.node.rerenderPathWithoutAnimation = false
      cmp.runChangeDetector() 
    })
    
    for(let i = 0; i < visitedNodes.length; i++){
      this.mycomponents.forEach((cmp: NodeComponent) => {
        if(cmp.node == visitedNodes[i]){
          cmp.node.rerenderWithoutAnimation = true
          cmp.runChangeDetector() 
        }
      })
    }

    this.rerenderShortestPath(visitedNodes) 
  }


  //----------------Bidirectional Swarm---------------------------------------

  // animateBidirectionalSwarm(){
  //   this.messageService.StartAnimation()
  //   this.messageService.SetAnimationInfo("Bidirectional")
  //   const bi = new BidirectionalSwarmAlgoService()
  //   const visitedNodes = bi.startAnimation(this.nodes, this.startNode, this.endNode)
    
  //   for(let i = 0; i < visitedNodes.length; i++){
  //     this.mycomponents.forEach((cmp: NodeComponent) => {
  //       if(cmp.node == visitedNodes[i]){
  //           setTimeout(() => {
  //               cmp.node.isVisitedAnimation = true
  //               cmp.runChangeDetector()
  //           }, 20*i)
  //         }
  //     })
  //   }
  //   setTimeout(() => {
  //     this.animateShortestPathBidirectionally(visitedNodes) 
  //   }, 20*visitedNodes.length)
  // }


  // rerenderBidirectionalSwarm(){
  //   const bi = new BidirectionalSwarmAlgoService()
  //   const visitedNodes = bi.startAnimation(this.nodes, this.startNode, this.endNode)
    
  //   this.mycomponents.forEach((cmp: NodeComponent) => {
  //     cmp.node.inPath = false
  //     cmp.node.isPathAnimation = false
  //     cmp.node.isVisitedAnimation = false
  //     cmp.node.rerenderWithoutAnimation = false
  //     cmp.node.rerenderPathWithoutAnimation = false
  //     cmp.runChangeDetector() 
  //   })
    
  //   for(let i = 0; i < visitedNodes.length; i++){
  //     this.mycomponents.forEach((cmp: NodeComponent) => {
  //       if(cmp.node == visitedNodes[i]){
  //         cmp.node.rerenderWithoutAnimation = true
  //         cmp.runChangeDetector() 
  //       }
  //     })
  //   }

  //   this.rerenderShortestPathBidirectionally(visitedNodes) 
  // }


  //-------------------Shortest Path-------------------------------------------


  animateShortestPath(visitedNodes){
    let shortestPath = []
    let lastnode = visitedNodes[visitedNodes.length - 1]
    if( lastnode.isEndNode === false ){
      this.messageService.StopAnimation()
      return
    }

    while(lastnode !== null){
      lastnode.rerenderWithoutAnimation = false
      lastnode.inPath = true
      shortestPath.push(lastnode)
      lastnode = lastnode.prevNode
    }
    shortestPath.reverse()

    for(let i = 0; i <= shortestPath.length - 1; i++){
      this.mycomponents.forEach((cmp: NodeComponent) => {
        if(cmp.node == shortestPath[i]){
          setTimeout(() => {
            cmp.node.isPathAnimation = true
            cmp.runChangeDetector()
          }, i*15)
        }
      })
    }

    setTimeout(() => {
      this.messageService.StopAnimation()
    }, 15*shortestPath.length)
    
  }

  rerenderShortestPath(visitedNodes){
    let shortestPath = []
    let lastnode = visitedNodes[visitedNodes.length - 1]
    if( lastnode.isEndNode === false ){
      this.messageService.StopAnimation()
      return
    }

    while(lastnode !== null){
      lastnode.rerenderWithoutAnimation = false
      lastnode.inPath = true
      shortestPath.push(lastnode)
      lastnode = lastnode.prevNode
    }

    for(let i = 0; i <= shortestPath.length - 1; i++){
      this.mycomponents.forEach((cmp: NodeComponent) => {
        if(cmp.node == shortestPath[i]){
            cmp.node.isPathAnimation = true
            cmp.node.rerenderPathWithoutAnimation = true
            cmp.runChangeDetector()
          
        }
      })
    }
      this.messageService.StopAnimation()
  }


  // animateShortestPathBidirectionally(visitedNodes){
  //   let shortestPath = []
  //   let middleNode = visitedNodes[visitedNodes.length - 1]
  //   if( middleNode.isMiddleNode === false ){
  //     this.messageService.StopAnimation()
  //     return
  //   }

  //   while(middleNode !== null){
  //     middleNode.rerenderWithoutAnimation = false
  //     middleNode.inPath = true
  //     shortestPath.push(middleNode)
  //     middleNode = middleNode.prevNode
  //   }

  //   for(let i = 0; i <= shortestPath.length - 1; i++){
  //     this.mycomponents.forEach((cmp: NodeComponent) => {
  //       if(cmp.node == shortestPath[i]){
  //         setTimeout(() => {
  //           cmp.node.isPathAnimation = true
  //           cmp.runChangeDetector()
  //         }, i*15)
  //       }
  //     })
  //   }

  //   setTimeout(() => {
  //     this.messageService.StopAnimation()
  //   }, 15*shortestPath.length)
  // }


  // rerenderShortestPathBidirectionally(visitedNodes){
  //   let shortestPath = []
  //   let middleNode = visitedNodes[visitedNodes.length - 1]
  //   // let secondLastnode = visitedNodes[visitedNodes.length-2]
  //   if( middleNode.isMiddleNode === false ){
  //     this.messageService.StopAnimation()
  //     return
  //   }

  //   while(middleNode !== null){
  //     middleNode.rerenderWithoutAnimation = false
  //     middleNode.inPath = true
  //     shortestPath.push(middleNode)
  //     middleNode = middleNode.prevNode
  //   }

  //   for(let i = 0; i <= shortestPath.length - 1; i++){
  //     this.mycomponents.forEach((cmp: NodeComponent) => {
  //       if(cmp.node == shortestPath[i]){
  //           cmp.node.isPathAnimation = true
  //           cmp.node.rerenderPathWithoutAnimation = true
  //           cmp.runChangeDetector()
  //       }
  //     })
  //   }
  //   this.messageService.StopAnimation() 
  // }


  //-----------------------------------------------------------------------------------------


  RandomMaze(event: Event){
    this.mycomponents.forEach((cmp: NodeComponent) => {
      if (cmp.node.isWall){
        cmp.node.isWall = !cmp.node.isWall
        cmp.runChangeDetector()
      }
    })

    this.mycomponents.forEach((cmp: NodeComponent) => {
      let wallGenerator = Math.random()
      if(wallGenerator >= 0.7){
        if(!cmp.node.isStartNode && !cmp.node.isEndNode){
          cmp.node.isWall = !cmp.node.isWall
          cmp.runChangeDetector()
        } 
      }
    })
  }


  RunChangeDetector(type = 'all', index?) {
    if (type == 'all') {
      let toRun = []
      this.mycomponents.forEach((cmp: NodeComponent) => {
        toRun.push(cmp.runChangeDetector())
      });
      Promise.all(toRun)
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
