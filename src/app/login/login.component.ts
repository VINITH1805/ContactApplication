import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../user.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginModel: User[] = [{ username: '', password: '' }]; // Initialize with an empty User object
  @ViewChild('loginForm') loginForm!: NgForm;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.logout();
  }

  onSubmit() {
    if (this.loginModel.length > 0) {
      const userToLogin = this.loginModel[0]; // Get the first User object from the array
      this.authService.login(userToLogin.username, userToLogin.password).subscribe(
        (data: any) => {
          this.authService.saveToken(data.token); // Store token in local storage
          this.router.navigate(['/contact']); // Redirect to contact list on success
        },
        (error: any) => {
          console.error(error);
          // Handle login errors (e.g., display error message)
        }
      );
    } else {
      console.error('No user object found in loginModel array.');
      // Handle error when no User object is present in loginModel
    }
  }

  goToRegister() {
    this.router.navigate(['/register']); // Navigate to register route
  }

  isFormValid(usernameInput: any, passwordInput: any): boolean {
    return usernameInput.valid && usernameInput.value !== '' && passwordInput.valid && passwordInput.value !== '';
  }
}
