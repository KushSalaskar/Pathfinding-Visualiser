import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {

  constructor() { }

  messages = new Subject();
  messages$ = this.messages.asObservable();

  isMouseClicked: boolean = false;


  notify(message) {
    this.messages.next(message);
  }

  MouseClicked() {
    this.isMouseClicked = true;
  }
  MouseRelease() {
    this.isMouseClicked = false;
  }

  GetMouseClicked() {
    return this.isMouseClicked;
  }
}
