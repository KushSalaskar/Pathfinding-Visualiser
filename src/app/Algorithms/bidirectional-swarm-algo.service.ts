import { Injectable } from '@angular/core';
import { Node } from '../Interfaces/node'
import { MessageServiceService } from '../Services/message-service.service'

@Injectable({
  providedIn: 'root'
})
export class BidirectionalSwarmAlgoService {

  constructor() { }
  startAnimation(nodes, startNode, endNode){
    startNode.distance = 0
    endNode.endNodeDistance = 0
    let unvisitedNodesForStart: Array<Node> = []
    let unvisitedNodesForEnd: Array<Node> = []
    let visitedNodes = {}
    let nodeToAnimate: Array<Node> = []
    for(let node of nodes){
      unvisitedNodesForStart.push(...node)
      unvisitedNodesForEnd.push(...node)
    }
    
    if(startNode.isVisited === true){
      for(let i = 0; i < unvisitedNodesForStart.length; i++){
        if(unvisitedNodesForStart[i].isStartNode === false){
          unvisitedNodesForStart[i].distance = Infinity
          unvisitedNodesForStart[i].isVisited = false
          if(unvisitedNodesForStart[i].isMiddleNode === true){
            unvisitedNodesForStart[i].isMiddleNode = false
            unvisitedNodesForStart[i].otherPrevNode = null
            unvisitedNodesForStart[i].prevNode = null
          }
        }
      }
    }

    if(startNode.isVisited === true){
      for (let i = 0; i < unvisitedNodesForEnd.length; i++){
        if(unvisitedNodesForEnd[i].isEndNode === false){
          unvisitedNodesForEnd[i].endNodeDistance = Infinity
          unvisitedNodesForEnd[i].isVisited = false
          if(unvisitedNodesForEnd[i].isMiddleNode === true){
            unvisitedNodesForEnd[i].isMiddleNode = false
            unvisitedNodesForEnd[i].otherPrevNode = null
            unvisitedNodesForEnd[i].prevNode = null
          }
        }
      }
    }

    while(unvisitedNodesForStart.length > 0 && unvisitedNodesForEnd.length > 0){
      let currentNodeFromStart = this.closestNodeFromStart(unvisitedNodesForStart)
      let currentNodeFromEnd = this.closestNodeFromEnd(unvisitedNodesForEnd)
      while((currentNodeFromStart.isWall === true || currentNodeFromEnd.isWall === true) && unvisitedNodesForStart.length > 0 && unvisitedNodesForEnd.length > 0){
        if (currentNodeFromStart.isWall === true) currentNodeFromStart = this.closestNodeFromStart(unvisitedNodesForStart)
        if (currentNodeFromEnd.isWall === true) currentNodeFromEnd = this.closestNodeFromEnd(unvisitedNodesForEnd)
      }
     
      if(currentNodeFromStart.distance === Infinity || currentNodeFromEnd.endNodeDistance === Infinity){
        return nodeToAnimate
      }
      nodeToAnimate.push(currentNodeFromStart)
      nodeToAnimate.push(currentNodeFromEnd)
      currentNodeFromStart.isVisited = true
      currentNodeFromEnd.isVisited = true
      
      if(visitedNodes[currentNodeFromStart.row.toString()+","+currentNodeFromStart.col.toString()]){
        currentNodeFromStart.isMiddleNode = true
        nodeToAnimate.pop()
        return nodeToAnimate
      } else if(visitedNodes[currentNodeFromEnd.row.toString()+","+currentNodeFromEnd.col.toString()]){
        currentNodeFromEnd.isMiddleNode = true
        return nodeToAnimate
      } else if(currentNodeFromStart === currentNodeFromEnd){
        currentNodeFromEnd.isMiddleNode = true
        nodeToAnimate.pop()
        return nodeToAnimate
      }
      
      visitedNodes[currentNodeFromStart.row.toString()+","+currentNodeFromStart.col.toString()] = true
      visitedNodes[currentNodeFromEnd.row.toString()+","+currentNodeFromEnd.col.toString()] = true
      this.updateAdjacentNodes(nodes, currentNodeFromStart, endNode)
      this.updateAdjacentEndNodes(nodes, currentNodeFromEnd, startNode)
    }
    
  }


  closestNodeFromStart(unvisitedNodes){
    let currentClosest
    let index
    for (let i = 0; i < unvisitedNodes.length; i++) {
      if (!currentClosest || currentClosest.distance > unvisitedNodes[i].distance) {
        currentClosest = unvisitedNodes[i]
        index = i
      }
    }
    unvisitedNodes.splice(index, 1)
    return currentClosest
  }

  closestNodeFromEnd(unvisitedNodes){
    let currentClosest
    let index
    for (let i = 0; i < unvisitedNodes.length; i++) {
      if (!currentClosest || currentClosest.endNodeDistance > unvisitedNodes[i].endNodeDistance) {
        currentClosest = unvisitedNodes[i]
        index = i
      }
    }
    unvisitedNodes.splice(index, 1)
    return currentClosest
  }
  

  updateAdjacentNodes(nodes, currentNode, endNode){
    let adjacentNodes = this.getAdjacentNodes(nodes, currentNode)
    let distanceToCompare = currentNode.distance + 1 * this.getHueristicDistance(currentNode, endNode)
    for(let adjacentNode of adjacentNodes){
      adjacentNode.distance = currentNode.distance + 1 * this.getHueristicDistance(adjacentNode, endNode)
      if(distanceToCompare < adjacentNode.distance){
        adjacentNode.distance = distanceToCompare
        adjacentNode.prevNode = currentNode
      } 
    }
  }

  updateAdjacentEndNodes(nodes, currentNode, endNode){
    let adjacentNodes = this.getAdjacentNodes(nodes, currentNode)
    let distanceToCompare = currentNode.endNodeDistance + 1 * this.getHueristicDistance(currentNode, endNode)
    for(let adjacentNode of adjacentNodes){
      adjacentNode.endNodeDistance = currentNode.endNodeDistance + 1 * this.getHueristicDistance(adjacentNode, endNode)
      if(distanceToCompare < adjacentNode.endNodeDistance){
        adjacentNode.endNodeDistance = distanceToCompare
        adjacentNode.otherPrevNode = currentNode
      }
    }
  }

  getAdjacentNodes(nodes, currentNode){
    let adjacentNodes: Array<Node> = []
    if(currentNode.row > 0){
      adjacentNodes.push(nodes[currentNode.row - 1][currentNode.col])
    }
    if(currentNode.row < nodes.length - 1){
      adjacentNodes.push(nodes[currentNode.row + 1][currentNode.col])
    }
    if(currentNode.col > 0){
      adjacentNodes.push(nodes[currentNode.row][currentNode.col - 1])
    }
    if(currentNode.col < nodes[0].length - 1){
      adjacentNodes.push(nodes[currentNode.row][currentNode.col + 1])
    }
    return adjacentNodes
  }

  getHueristicDistance(node1: Node, node2: Node): any{
    let x1 = node1.row
    let x2 = node2.row
    let y1 = node1.col
    let y2 = node2.col

    let xChange = Math.abs(x1 - x2)
    let yChange = Math.abs(y1 - y2)

    return (xChange + yChange)
  }
}
