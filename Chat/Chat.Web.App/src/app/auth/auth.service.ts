import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { tokenNotExpired, AuthHttp } from 'angular2-jwt';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { UserLogin } from '../model';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  private usersUrl = environment.api + 'users';
  private authUrl = environment.api + 'auth';

  crendentials = new UserLogin();

  constructor(
    private router: Router,
    private http: Http,
    private authHttp: AuthHttp
  ) {
    if (this.authenticated) {
      this.initUserData();
    } else {
     // this.user = null;
    }
  }

  get authenticated() {
    return tokenNotExpired('tokenItem');
  }

  private initUserData(_token?: any) {
    const token = _token ? _token : localStorage.getItem('tokenItem');
    const tokeninfo = this.parseJwt(token);
    // const _user = new UserLogin();
    // _user.name = tokeninfo.Name;
    //_user.lastname = tokeninfo.Lastname;
   // this.user = _user;
  }

  public login(username: string, password: string): Observable<any> {

    this.crendentials.username = username;
    this.crendentials.password = password;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.authUrl, this.crendentials, options)
      .map((response: any) => {
        const token = response.json().token;
        if (token) {
          localStorage.setItem('tokenItem', token);
          this.initUserData(token);
          return true;
        } else {
          return false;
        }
      })
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  public logOut() {
    localStorage.removeItem('tokenItem');
    //this.user = null;
    this.router.navigate(['/login']);
  }

  parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }


  private authJsonHeaders(): Observable<Headers> {
    const header = new Headers();

    header.append('Content-Type', 'application/json');
    header.append('Accept', 'application/json');

    const token = localStorage.getItem('tokenItem');
    if (token) {
      header.append('Authorization', 'Bearer ' + token);
      return Observable.of(header);
    } else {
     // this.user = null;
      return Observable.of(header);
    }
  }

  //Rest API HTTP methods
  public get(url: string): Observable<any> {
    return this.authJsonHeaders().flatMap(res => {
      return this.http.get(url, { headers: res })
        .map(res => res)
        .catch(err => this.handleError(err));
    });
  }

  public post(url: string, data: any): Observable<any> {
    return this.authJsonHeaders().flatMap(res => {
      return this.http.post(url, data, { headers: res })
        .map(res => res)
        .catch(err => this.handleError(err));
    });
  }

  public put(url: string, data: any): Observable<any> {
    return this.authJsonHeaders().flatMap(res => {
      return this.http.put(url, data, { headers: res })
        .map(res => res)
        .catch(err => this.handleError(err));
    });
  }

  public delete(url: string): Observable<any> {
    return this.authJsonHeaders().flatMap(res => {
      return this.http.delete(url, { headers: res })
        .map(res => res)
        .catch(err => this.handleError(err));
    });
  }

  private handleError(error: Response) {
    if (error.status == 401) {
      this.router.navigateByUrl('/login');
      return Observable.throw(error.statusText);
    } else {
      return Observable.throw(error.text());
    }
  }
}
