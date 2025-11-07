import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonItem,
  IonInput,
  IonNote,
  IonButton,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { Auth } from 'src/app/services/authService/auth';
import { NavController } from '@ionic/angular';
import { Loader } from 'src/app/services/loaderService/loader';
import { authResponse } from 'src/app/models/auth.model';
import { addIcons } from 'ionicons';
import { mailSharp, lockClosed } from 'ionicons/icons';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonNote,
    IonInput,
    IonItem,
    IonIcon,
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonInputPasswordToggle,
  ],
})
export class LoginPagePage implements OnInit {
  loginForm!: FormGroup;
  loginSubcription!: Subscription;

  constructor(
    private authService: Auth,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private loader: Loader
  ) {
    addIcons({lockClosed, mailSharp})
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['aryan@gmail.com', [Validators.required, Validators.email]],
      password: ['12345', [Validators.required, Validators.minLength(5)]],
    });
  }

  async onLonginFormSubmit() {
    if (this.loginForm.valid) {
      const {email, password} = this.loginForm.value;
      await this.loader.presentLoading('Please Wait, Logging in....', 0);
      this.loginSubcription = this.authService
        .loginFormSubmission(this.loginForm.value)
        .subscribe({
          next: async (response: any) => {
            this.authService.saveToken(response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.navCtrl.navigateForward('home');
          },
          error: (error) => {
            console.error(
              `Error Occured while logging in, Please Try Later....`,
              error
            );
          },
        });
    }
  }

  ionViewDidLeave() {
    if(this.loginSubcription){
      this.loginSubcription.unsubscribe();
    }
  }
}
