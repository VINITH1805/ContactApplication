import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../contact.service';


@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
  // animations: [
  //   trigger('toastAnimation', [
  //     transition(':enter', [
  //       style({ opacity: 0, transform: 'translateY(-100%)' }),
  //       animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  //     ]),
  //     transition(':leave', [
  //       animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-100%)' }))
  //     ])
  //   ])
  // ]
})
export class EditContactComponent implements OnInit {
  contact: Contact = {} as Contact; // Initialize with empty object
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
  ) {}

  ngOnInit() {
    // Retrieve contact ID from route parameters
    const contactId = this.route.snapshot.paramMap.get('id');

    if (contactId) {
      this.contactService.getContactsById(+contactId)
        .subscribe(contact => {
            this.contact = contact;
        }, error => {
          this.errorMessage = 'Error fetching contact: ' + error.message;
        });
    } else {
      // Handle the case where no contact ID is provided
      this.errorMessage = 'Contact ID not found in route parameters.';
    }
  }

  onSubmit() {
    this.contactService.editContact(this.contact)
      .subscribe(editedContact => {
        alert("Saved Changes");
        this.router.navigate(['/contact']); // Redirect to edited contact view
      }, error => {
        this.errorMessage = 'Error editing contact: ' + error.message;
      });
  }
  isContactFormValid(firstNInput: any, lastNInput: any, emailInput: any, phoneNumberInput:any,addressInput:any,cityInput:any,stateInput:any,countryInput:any,postalcodeInput:any): boolean {
    return firstNInput.valid && firstNInput.value !== '' &&
           lastNInput.valid && lastNInput.value !== '' &&
           emailInput.valid && emailInput.value !== '' &&
           addressInput.valid && addressInput.value !== '' &&
           cityInput.valid && cityInput.value !== '' &&
           stateInput.valid && stateInput.value !== '' &&
           countryInput.valid && countryInput.value !== '' &&
           phoneNumberInput.valid && phoneNumberInput.value !== '' &&
           postalcodeInput.valid && postalcodeInput.value !== '';
}
}
