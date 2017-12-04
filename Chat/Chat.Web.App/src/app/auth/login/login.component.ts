import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from '../../model';

import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  user = new UserLogin();

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  login() {
    this.auth.login(this.user.username, this.user.password).subscribe(res => {
      if (res) {
        this.router.navigate(['/home']);
      } else {
        
      }
    }, error => {
    });
  }
}
