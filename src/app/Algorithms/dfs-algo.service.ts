import { Injectable } from '@angular/core';
import { Node } from "../Interfaces/node"
import { MessageServiceService } from "../Services/message-service.service"

@Injectable({
  providedIn: 'root'
})
export class DFSAlgoService {

  constructor() { }

  startAnimation(nodes, startNode, endNode){
    const visitedNodes: Array<Node> = []
    const stack: Array<Node> = []
    
    if(startNode.isVisited === true){
      for(let i=0; i < 17; i++){
        for(let j=0; j < 40; j++){
          nodes[i][j].isVisited = false
        }
      }
    }

    stack.push(startNode)
    
    while(stack.length > 0){
      const currentNode = stack[stack.length - 1]
      currentNode.isVisited = true

      visitedNodes.push(currentNode)
      if (currentNode.row === endNode.row && currentNode.col === endNode.col){
        return visitedNodes
      }
      this.updateAdjacentNodes(stack, nodes, currentNode)
    }
    if(stack.length === 0){
      return visitedNodes
    }
    
  }


  updateAdjacentNodes(stack, nodes, currentNode){
    let adjacentNodes = this.getAdjacentNodes(nodes, currentNode)
    if (adjacentNodes.length > 0){
      adjacentNodes[0].prevNode = currentNode
      stack.push(adjacentNodes[0])
    }
    else{
        stack.pop()
      }
  }

  getAdjacentNodes(nodes, currentNode){
    let adjacentNodes: Array<Node> = []
    if(currentNode.row > 0){
      adjacentNodes.push(nodes[currentNode.row - 1][currentNode.col])
    }
    if(currentNode.col < nodes[0].length - 1){
      adjacentNodes.push(nodes[currentNode.row][currentNode.col + 1])
    }
    if(currentNode.row < nodes.length - 1){
      adjacentNodes.push(nodes[currentNode.row + 1][currentNode.col])
    }
    if(currentNode.col > 0){
      adjacentNodes.push(nodes[currentNode.row][currentNode.col - 1])
    }
    
    adjacentNodes = adjacentNodes.filter(
      adjacentNode => !adjacentNode.isVisited && !adjacentNode.isWall
    )
    return adjacentNodes
  }
}
