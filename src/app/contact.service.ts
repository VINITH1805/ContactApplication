import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://localhost:7121/api/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getContacts(): Observable<any[]> {
      const headers = this.authService.createAuthorizationHeader();
      return this.http.get<any[]>(`${this.apiUrl}Contacts`, headers);
  }

  getContactsById(id: number): Observable<Contact> {
      const headers = this.authService.createAuthorizationHeader();
      return this.http.get<Contact>(`${this.apiUrl}Contacts/${id}`, headers);
  }

  addContact(contact: Contact): Observable<Contact> {
      const headers = this.authService.createAuthorizationHeader();
      return this.http.post<Contact>(`${this.apiUrl}Contacts`, contact, headers);
  }

  editContact(contact: Contact): Observable<Contact> {
      const headers = this.authService.createAuthorizationHeader();
      return this.http.put<Contact>(`${this.apiUrl}Contacts/${contact.id}`, contact, headers);
  }

  deleteContact(id: number): Observable<void> {
      const headers = this.authService.createAuthorizationHeader();
      return this.http.delete<void>(`${this.apiUrl}Contacts/${id}`, headers);
  }
}