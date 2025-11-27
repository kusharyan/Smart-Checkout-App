import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonInput,
  IonNote,
  IonInputPasswordToggle,
  IonButton,
  IonText,
} from '@ionic/angular/standalone';
import { Auth } from 'src/app/services/authService/auth';
import { NavController } from '@ionic/angular';
import { Loader } from 'src/app/services/loaderService/loader';
import { authResponse } from 'src/app/models/auth.model';
import { person, lockClosed, mailSharp } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.page.html',
  styleUrls: ['./signup-page.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonButton,
    IonNote,
    IonInput,
    IonIcon,
    IonInputPasswordToggle,
    IonItem,
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class SignupPagePage implements OnInit {
  signupForm!: FormGroup;
  signupSubcription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private navCtrl: NavController,
    private loader: Loader
  ) {
    addIcons({ person, mailSharp, lockClosed });
  }

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSignupFormSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.signupSubcription = this.authService
        .registerUserSubmission(this.signupForm.value)
        .subscribe({
          next: async (response: any) => {
            try {
              await this.loader.presentLoading('Signing Up...', 0);
              console.log(`User Signup Succesfull`, response);
              alert(`Signup Successfull, Please Login!`);
              await this.navCtrl.navigateForward('/login');
            } catch (error) {
              console.error('Signup Error:', error);
            }
          },
        });
    }
  }

  ionViewDidLeave() {
    if (this.signupSubcription) {
      this.signupSubcription.unsubscribe();
    }
  }
}
