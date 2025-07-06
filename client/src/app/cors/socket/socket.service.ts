import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;
  private statusSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentStatus = this.statusSubject.asObservable();

  constructor() {
    this.socket = io('https://findtalent.onrender.com'); // Your server URL

    // Listen for 'statusChanged' event from the server
    this.socket.on('statusChanged', (statusData: any) => {
      this.statusSubject.next(statusData);
    });
  }

  // Emit statusUpdated event to server
  emitStatusUpdated(statusData: any): void {
    this.socket.emit('statusUpdated', statusData);
  }
}
