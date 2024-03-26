import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../user.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerModel: User[] = [{ username: '', password: '' }]; // Initialize with an empty User object
  @ViewChild('registerForm') registerForm!: NgForm;
  nameExists: Boolean | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    this.nameExist();
    if (this.registerModel.length > 0) {
      const userToRegister = this.registerModel[0]; // Get the first User object from the array
      this.authService.register(userToRegister.username,userToRegister.password).subscribe(
        (data: any) => {
          console.log('Registration successful!');
          this.router.navigate(['']); // Redirect to login page after successful registration
        },
        (error: any) => {
          console.error(error);
          // Handle registration errors (e.g., display error message)
        }
      );
    } else {
      console.error('No user object found in registerModel array.');
      // Handle error when no User object is present in registerModel
    }
  }
  isFormValid(usernameInput: any, passwordInput: any): boolean {
    return usernameInput.valid && usernameInput.value !== '' && passwordInput.valid && passwordInput.value !== '';
  }
  nameExist() {
    if(this.registerModel.length > 0){
      const userToRegister = this.registerModel[0];
      this.authService.checkNameExists(userToRegister.username).subscribe(response => {
        this.nameExists = response.exists;
      });
    }
    
  }
}