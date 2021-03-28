import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {

  isAnimationRunning: boolean
  isAnimationOnBoard: boolean
  isMouseClicked: boolean
  isPrimaryNode: boolean
  isNodeForWall: boolean
  nodeDataArr: Array<Node>
  animationRunningArr: Array<any>
  constructor() { 
    this.isMouseClicked = false
    this.isPrimaryNode = false
    this.isNodeForWall = false
    this.isAnimationRunning = false
    this.nodeDataArr = []
    this.animationRunningArr = []
    this.isAnimationOnBoard = false
  }

  messages = new Subject();


  SetAnimationOnBoard(){
    this.isAnimationOnBoard = true
  }
  ResetAnimationOnBoard(){
    this.isAnimationOnBoard = false
  }
  AnimationOnBoardInfo(){
    return this.isAnimationOnBoard
  }

  
  SetAnimationInfo(animationInfo){
    this.animationRunningArr.push(animationInfo)
  }

  GetAnimationInfo(){
    if(this.animationRunningArr.length === 0) return "Null"
    return this.animationRunningArr[0]
  }

  ResetAnimationInfo(){
    this.animationRunningArr = []
  }

  SetNodeData(node){
    this.nodeDataArr.push(node)
  }

  GetNodeData(){
    return this.nodeDataArr.pop()
  }


  notify(message) {
    this.messages.next(message);
  }
  ClickedForWall(){
    this.isNodeForWall = true
  }

  ReleasedForWall(){
    this.isNodeForWall = false
  }

  GetNodeForWall(){
    return this.isNodeForWall
  }

  MouseClicked() {
    this.isMouseClicked = true;
  }
  MouseRelease() {
    this.isMouseClicked = false;
  }

  PrimaryNodeClicked(){
    this.isPrimaryNode = true
  }

  PrimaryNodeReleased(){
    this.isPrimaryNode = false
  }

  GetPrimaryNodeClicked(){
    return this.isPrimaryNode
  }

  GetMouseClicked() {
    return this.isMouseClicked
  }

  StartAnimation(){
    this.isAnimationRunning = true
  }

  StopAnimation(){
    this.isAnimationRunning = false
  }

  GetAnimationState(){
    return this.isAnimationRunning
  }


}
