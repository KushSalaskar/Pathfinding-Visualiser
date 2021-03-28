import { Injectable } from '@angular/core';
import { Node } from "../Interfaces/node"
import { MessageServiceService } from "../Services/message-service.service"

@Injectable({
  providedIn: 'root'
})
export class DijkstraAlgoService {

  constructor(
  ) { }

  startAnimation(nodes, startNode, endNode){
    startNode.distance = 0
    const unvisitedNodes: Array<Node> = []
    const visitedNodes: Array<Node> = []
    for(let node of nodes){
      unvisitedNodes.push(...node)
    }
    
    while(unvisitedNodes.length > 0){
      this.sortNodes(unvisitedNodes)
      const currentNode = unvisitedNodes.shift()
      currentNode.isVisited = true
      
      if(currentNode.distance === Infinity){
        return visitedNodes
      }
      visitedNodes.push(currentNode)
      if(currentNode.row === endNode.row && currentNode.col === endNode.col){
        return visitedNodes
      }
      this.updateAdjacentNodes(nodes, currentNode)
    }
    
  }

  sortNodes(nodes){
    nodes.sort((a,b) => a.distance - b.distance)
  }

  updateAdjacentNodes(nodes, currentNode){
    let adjacentNodes = this.getAdjacentNodes(nodes, currentNode)
    for(let adjacentNode of adjacentNodes){
      adjacentNode.distance = currentNode.distance + 1
      adjacentNode.prevNode = currentNode
    }
  }

  getAdjacentNodes(nodes, currentNode){
    let adjacentNodes: Array<Node> = []
    if(currentNode.row > 0){
      adjacentNodes.push(nodes[currentNode.row - 1][currentNode.col])
    }
    if(currentNode.col > 0){
      adjacentNodes.push(nodes[currentNode.row][currentNode.col - 1])
    }
    if(currentNode.row < nodes.length - 1){
      adjacentNodes.push(nodes[currentNode.row + 1][currentNode.col])
    }
    if(currentNode.col < nodes[0].length - 1){
      adjacentNodes.push(nodes[currentNode.row][currentNode.col + 1])
    }
    adjacentNodes = adjacentNodes.filter(
      adjacentNode => !adjacentNode.isVisited && !adjacentNode.isWall
    )
    return adjacentNodes
  }
}
