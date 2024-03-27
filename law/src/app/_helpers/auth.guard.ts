import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
        if (localStorage.getItem('currentUser')) {
            // User is logged in
            return true;
        }

        // User is not logged in, redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
}
