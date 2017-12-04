import { Component, OnInit } from '@angular/core';
import { Message } from '../model';

import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  apiUrl = "";
  messages = new Array<Message>();
  msg = new Message();
  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

  send() {
    if (!this.msg.text) { return; }
    this.msg.time = new Date();
    this.msg.user = "Nikos";
    this.msg.nickname = "qq";
    this.messages.push(this.msg);
    this.msg = new Message();
    // this.auth.post(this.apiUrl, this.msg).subscribe(res => {
    //   this.messages.push(res);
    // }, error => {

    // });
  }

}
