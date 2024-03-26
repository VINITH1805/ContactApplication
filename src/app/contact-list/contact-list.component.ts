import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  
  constructor(private contactService: ContactService,private router: Router,private authService: AuthService) {} // Inject MatDialog

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    this.contactService.getContacts()
      .subscribe(contacts => this.contacts = contacts);
  }

  // Function to handle edit button click (opens edit contact popup)
  onEditContact(contact: Contact): void {
    this.router.navigate(['/edit-contact', contact.id]);
  }

  // Function to handle delete button click (prompts for confirmation and deletes)
  onDeleteContact(contact: Contact): void {
    function formatConfirmationMessage() {
      return `Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`;
    }
    
    const message = formatConfirmationMessage();
    if (confirm(message)) {
      this.contactService.deleteContact(contact.id)
        .subscribe(
          () => { // Success callback (if backend returns a success response)
            this.contacts = this.contacts.filter(c => c.id !== contact.id);
          },
          (error) => { // Error callback
            console.error('Error deleting contact:', error);
            // Handle the error appropriately (e.g., display an error message to the user)
          }
        );
    }
  }
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout(); // Call logout method from AuthService
      this.router.navigate(['']); // Redirect to login page after logout
    }
  }
  
    
}