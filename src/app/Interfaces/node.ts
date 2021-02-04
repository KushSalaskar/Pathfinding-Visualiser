export interface Point {
    row: number
    col: number
}

export class Node {
    isStartNode
    isEndNode
    isVisited
    row
    col
    distance
    inPath = false
    prevNode
    isWall

    constructor(
        row,
        col,
        wall = false,
        visited = false,
        startNode: Point = null,
        endNode: Point = null
    ){
        this.row = row
        this.col = col
        this.isWall = wall
        this.isVisited = visited
        this.isStartNode = this.samePoint(startNode, { row, col })
        this.isEndNode = this.samePoint(endNode, { row, col })
        this.distance = 9999999999
        this.prevNode = null
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

    markAsVisited() {
        this.isVisited = true
    }

    reset(){
        this.isVisited = false
        this.distance = 9999999999
        this.isStartNode = null
        this.isEndNode = null
        this.inPath = false
        this.isWall = false
    }
}

