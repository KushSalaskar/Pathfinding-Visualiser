import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { MessageServiceService } from 'src/app/Services/message-service.service'
import {Node} from '../../interfaces/node';
import { BehaviorSubject, Subject } from 'rxjs';


@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent implements OnInit, OnChanges {
  @Input('node') node: Node
  @Output('dropped') dropped: EventEmitter<any> = new EventEmitter<any>()

  isStartNode = false
  isEndNode = false
  

  @ViewChild('nodeel', { static: true }) nodeEl;

  constructor(
    public messageService: MessageServiceService,
    private ref: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    
  }

  ngAfterViewInit() {}

  ngOnChanges(changes) {
  }

  @HostListener('mouseenter', ['$event']) onmouseenter(event: Event) {
    if(this.messageService.GetAnimationState() === true){
      event.stopPropagation()
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    
    if (
      this.messageService.GetNodeForWall() == true &&
      !this.node.isEndNode &&
      !this.node.isStartNode
    ) {
      this.node.isWall = !this.node.isWall
     }


    if(this.messageService.GetPrimaryNodeClicked() === true){
      if(this.node.isWall){
        return
      }
      let prevNode = this.messageService.GetNodeData()
      let newNode:Node = this.node
      this.messageService.SetNodeData(this.node)
      this.dropped.emit({
        previousNode: prevNode,
        newNode: newNode,
      })
    }
    
  }

  runChangeDetector() {
    this.ref.markForCheck()
  }

  MouseUp(event: Event) {
    if(this.messageService.GetAnimationState() === true){
      event.stopPropagation()
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
      this.messageService.MouseRelease()
      this.messageService.PrimaryNodeReleased()
      this.messageService.ReleasedForWall()
      
  }

  MouseDown(event: Event) {
    if(this.messageService.GetAnimationState() === true){
      event.stopPropagation()
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }

    if (this.node.isStartNode || this.node.isEndNode) {
      this.messageService.PrimaryNodeClicked()
      this.messageService.SetNodeData(this.node)
      return
    }
    this.messageService.ClickedForWall()
    this.node.isWall = !this.node.isWall
  }
}