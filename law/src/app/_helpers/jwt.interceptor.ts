import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get currentUser from localStorage
        let currentUserString = localStorage.getItem('currentUser');
        if (currentUserString) {
            let currentUser = JSON.parse(currentUserString);
            if (currentUser && currentUser.token) {
                // Add authorization header with JWT token if available
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
            }
        }
        return next.handle(request);
    }
}
