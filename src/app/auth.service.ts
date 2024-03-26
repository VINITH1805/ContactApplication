import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>('https://localhost:7121/api/Auth/login', { username, password })
            .pipe(
                tap(response => this.saveToken(response.token))
            );
    }

    register(username: string, password: string) {
        return this.http.post<any>('https://localhost:7121/api/Auth/register', { username, password });
    }

    checkNameExists(Username: string): Observable<any> {
        return this.http.get<any>(`https://localhost:7121/api/Auth/CheckNameExists?Username=${Username}`);
    }

    public saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    getAuthToken(): string | null {
        return localStorage.getItem('token');
    }

    logout() {
        localStorage.removeItem('token');
    }
    
    isLoggedIn(): boolean {
        return !!this.getAuthToken();
    }

    createAuthorizationHeader(): { headers: { Authorization: string } } {
        const token = this.getAuthToken();
        return { headers: { Authorization: `Bearer ${token}` } };
    }
}
