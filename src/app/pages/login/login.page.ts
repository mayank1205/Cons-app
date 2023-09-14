import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { LoginPageForm } from './login.page.form';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from 'src/store/AppState';
import { hide, show } from 'src/store/loading/loading.actions';
import { login, loginFail, loginSuccess, recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from 'src/store/login/login.actions';
import { ToastController } from '@ionic/angular';
import { LoginState } from 'src/store/login/LoginState';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  form: FormGroup;
  apiError: String;
  loginStateSubscription: Subscription;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private formbuilder: FormBuilder, 
    private store: Store<AppState>,
    private toastController:ToastController) { }

  login(){
    this.store.dispatch(login());
  }

  forgotEmailPassword() {
    this.store.dispatch(recoverPassword())
  }

  ngOnInit() {
    this.form = new LoginPageForm(this.formbuilder).createForm();
    this.loginStateSubscription = this.store.select('login').subscribe(loginState => {
      this.onIsRecoveringPassword(loginState);
      this.onIsRecoveredPassword(loginState);
      this.onIsLoggingIn(loginState);
      this.onIsLoggedIn(loginState);
      this.onError(loginState);
      this.toggleLoading(loginState);
    })
    
  }

  ngOnDestroy() {
      if(this.loginStateSubscription){
        this.loginStateSubscription.unsubscribe();
      }
  }

  toggleLoading(loginState: LoginState) {
    console.log('this is toggle loading', loginState);
    if(loginState.isLoggingIn || loginState.isRecoveringPassword) {
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    }
  }

  private onIsLoggingIn(loginState: LoginState) {
    if(loginState.isLoggingIn) {
      this.authService.login(this.form.value).subscribe((response:any) => {
        console.log(response);
        console.log(response.body)
        if(response.body.success){
          let user = response.body.data;
          localStorage.setItem('mobile', user.mobile)
          localStorage.setItem('name', user.name)
          localStorage.setItem('token', response.headers.get('Authorization'))
          this.store.dispatch(loginSuccess({user}));
        } else {
          this.apiError = response.body.message;
          console.log('error')
          this.store.dispatch(loginFail({error: {message: this.apiError}}));
        }
      });
    }
  }

  private onIsLoggedIn(loginState: LoginState) {
    if(loginState.isLoggedIn) {
      this.router.navigate(['home']);
    }
  }

  private async onError(loginState: LoginState) {
    console.log(loginState.error);
    if(loginState.error){
      const toaster = await this.toastController.create({
        position: "bottom",
        message: loginState.error.message,
        color: "danger"
      });
      toaster.present();
    }
  }
  
  private onIsRecoveringPassword(loginState: LoginState){
    if(loginState.isRecoveringPassword){
      this.authService.recoverPassword(this.form.get('mobile')?.value).subscribe(() =>{
        this.store.dispatch(recoverPasswordSuccess());
      }, error => {
        this.store.dispatch(recoverPasswordFail({error}));
      });
    }
  }
  
  private async onIsRecoveredPassword(loginState: LoginState){
    if(loginState.isRecoveredPassword){
      const toaster = await this.toastController.create({
        position: "bottom",
        message: "Recovery link sent",
        color: "primary"
      });
      toaster.present();
    }
  }

}
