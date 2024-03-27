import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get users from localStorage
        let usersString = localStorage.getItem('users');
        let users: any[] = usersString ? JSON.parse(usersString) : [];

        // Check if request is for authentication
        if (request.url.endsWith('/authenticate') && request.method === 'POST') {
            // Get credentials from the request body
            let { username, password } = request.body;
            // Find user matching credentials
            let user = users.find(u => u.username === username && u.password === password);
            if (user) {
                // If user is found, return token
                let token = 'fake-jwt-token';
                let body = {
                    id: user.id,
                    username: user.username,
                    token: token
                };
                return of(new HttpResponse({ status: 200, body: body })).pipe(delay(500)); // Delay the response for simulation
            } else {
                // If user is not found, return error
                return of(new HttpResponse({ status: 400, body: { message: 'Username or password is incorrect' } })).pipe(delay(500)); // Delay the response for simulation
            }
        }

        // Check if request is for user registration
        if (request.url.endsWith('/users/register') && request.method === 'POST') {
            // Get the user data from the request body
            let newUser = request.body;
            // Add the new user to the users array
            users.push(newUser);
            // Update the localStorage with the new users array
            localStorage.setItem('users', JSON.stringify(users));
            // Return a success response
            return of(new HttpResponse({ status: 200 })).pipe(delay(500)); // Delay the response for simulation
        }

        // Pass through any requests not handled above
        return next.handle(request);
    }
}

// Provider for FakeBackendInterceptor
export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
