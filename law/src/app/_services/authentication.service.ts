import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models/user';
import {environment} from '../environments/environment'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
   // Inside the AuthenticationService class
   private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>({ id: 0, username: '', password: '', firstName: '', lastName: '', token: '' });
   public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
         this.currentUserSubject.next({});
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to an empty user object
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next({ id: 0, username: '', password: '', firstName: '', lastName: '', token: '' });
    }

}
