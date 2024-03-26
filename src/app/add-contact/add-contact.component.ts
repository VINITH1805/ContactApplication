import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css'],
})
export class AddContactComponent implements OnInit {
  contactForm!: FormGroup;
  newContact: Contact = {} as Contact;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
    });

    this.contactForm.valueChanges.subscribe(() => {
      this.checkFormValidity();
    });
  }

  checkFormValidity() {
    const formControls = this.contactForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        control.markAsTouched();
      }
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.contactService.addContact(this.contactForm.value)
        .subscribe(() => {
          this.router.navigate(['/contact']);
        },
        (error) => {
          console.error("Error adding contact:", error);
        });
    } else {
      console.log('Please fill in all required fields.');
    }
  }
}
