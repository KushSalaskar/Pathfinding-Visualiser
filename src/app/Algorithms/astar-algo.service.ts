import { Injectable } from '@angular/core';
import { Node } from "../Interfaces/node"
import { MessageServiceService } from "../Services/message-service.service"

@Injectable({
  providedIn: 'root'
})
export class AstarAlgoService {

  constructor() { }

  startAnimation(nodes, startNode, endNode){
    startNode.distance = 0
    startNode.totalDistance = 0
    const unvisitedNodes: Array<Node> = []
    const visitedNodes: Array<Node> = []
    for(let node of nodes){
      unvisitedNodes.push(...node)
    }
    if(startNode.isVisited === true){
      for(let i = 0; i < unvisitedNodes.length; i++){
        if(unvisitedNodes[i].isStartNode === false){
          unvisitedNodes[i].distance = Infinity
          unvisitedNodes[i].totalDistance = Infinity
          unvisitedNodes[i].heuristicDistance = null
          unvisitedNodes[i].isVisited = false
        }
      }
    }
    
    
    while(unvisitedNodes.length > 0){
      let currentNode = this.closestNode(unvisitedNodes, endNode)
      while(currentNode.isWall === true && unvisitedNodes.length > 0){
        currentNode = this.closestNode(unvisitedNodes, endNode)
      }
      currentNode.isVisited = true
      if(currentNode.distance === Infinity){
        return visitedNodes
      }
      visitedNodes.push(currentNode)
      if(currentNode.row === endNode.row && currentNode.col === endNode.col){
        return visitedNodes
      }
      this.updateAdjacentNodes(nodes, currentNode, endNode)
    }

  }

  closestNode(unvisitedNodes, endNode){
    let newClosest
    let closestIndex
      for(let i = 0; i < unvisitedNodes.length; i++){
        if(!newClosest || newClosest.totalDistance > unvisitedNodes[i].totalDistance){
          newClosest = unvisitedNodes[i]
          closestIndex = i
        } else if (newClosest.totalDistance === unvisitedNodes[i].totalDistance){
          if(newClosest.heuristicDistance > unvisitedNodes[i].heuristicDistance){
            newClosest = unvisitedNodes[i]
            closestIndex = i
          }
        }
      }
    
    unvisitedNodes.splice(closestIndex, 1)
    return newClosest

  }


  updateAdjacentNodes(nodes, currentNode, endNode){
    let adjacentNodes = this.getAdjacentNodes(nodes, currentNode)
    let distanceToCompare = currentNode.distance + 1
    
    for(let adjacentNode of adjacentNodes){
      if(!adjacentNode.heuristicDistance){
        adjacentNode.heuristicDistance = this.getHueristicDistance(adjacentNode, endNode)
      }
      if(distanceToCompare < adjacentNode.distance){
        adjacentNode.distance = distanceToCompare
        adjacentNode.totalDistance = adjacentNode.distance + adjacentNode.heuristicDistance
        adjacentNode.prevNode = currentNode
      }
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

  getHueristicDistance(node1: Node, node2: Node): Number{
    let x1 = node1.row
    let x2 = node2.row
    let y1 = node1.col
    let y2 = node2.col

    let xChange = Math.abs(x1 - x2)
    let yChange = Math.abs(y1 - y2)

    return (xChange + yChange)
  }
}

