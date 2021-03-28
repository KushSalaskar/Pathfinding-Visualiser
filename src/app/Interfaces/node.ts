export interface Point {
    row: number
    col: number
}

export class Node {
    isStartNode
    isEndNode
    isMiddleNode
    isVisited
    isVisitedAnimation
    isPathAnimation
    rerenderWithoutAnimation
    rerenderPathWithoutAnimation
    row
    col
    distance
    totalDistance
    endNodeDistance
    heuristicDistance
    inPath = false
    prevNode
    otherPrevNode
    isWall

    constructor(
        row,
        col,
        wall = false,
        visited = false,
        visitedAnimation = false,
        pathAnimation = false,
        rerenderWithoutAnimation = false,
        rerenderPathWithoutAnimation = false,
        startNode: Point = null,
        endNode: Point = null,
    ){
        this.row = row
        this.col = col
        this.isWall = wall
        this.isVisited = visited
        this.isVisitedAnimation = visitedAnimation
        this.isPathAnimation = pathAnimation
        this.rerenderWithoutAnimation = rerenderWithoutAnimation
        this.rerenderPathWithoutAnimation = rerenderPathWithoutAnimation
        this.isStartNode = this.samePoint(startNode, { row, col })
        this.isEndNode = this.samePoint(endNode, { row, col })
        this.isMiddleNode = false
        this.distance = Infinity
        this.endNodeDistance = Infinity
        this.totalDistance = Infinity
        this.heuristicDistance = null
        this.prevNode = null
        this.otherPrevNode = null
    }

    samePoint(point1, point2) {
        if (point1 === null){
            return false
        }
        if (point1.row === point2.row && point1.col === point2.col){
            return true
        } else {
            return false
        }
    }


    reset(){
        this.isVisitedAnimation = false
        this.isPathAnimation = false
        this.rerenderWithoutAnimation = false
        this.rerenderPathWithoutAnimation = false
        this.isVisited = false
        this.distance = Infinity
        this.totalDistance = Infinity
        this.endNodeDistance = Infinity
        this.heuristicDistance = null
        this.isStartNode = false
        this.isEndNode = false
        this.isMiddleNode = false
        this.inPath = false
        this.isWall = false
    }
}

