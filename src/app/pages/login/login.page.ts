import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { LoginPageForm } from './login.page.form';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from 'src/store/AppState';
import { hide, show } from 'src/store/loading/loading.actions';
import { recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from 'src/store/login/login.actions';
import { ToastController } from '@ionic/angular';
import { LoginState } from 'src/store/login/LoginState';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  apiError: String;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private formbuilder: FormBuilder, 
    private store: Store<AppState>,
    private toastController:ToastController) { }

  login(){
    this.authService.login(this.form.value).subscribe((response:any) => {
      console.log(response);
      console.log(response.body)
      if(response.body.success){
        let user = response.body.data;
        localStorage.setItem('mobile', user.mobile)
        localStorage.setItem('name', user.name)
        localStorage.setItem('token', response.headers.get('Authorization'))
        this.router.navigate(['home']);
      } else {
        this.apiError = response.body.message;
        console.log('error')
      }
    });
  }

  forgotEmailPassword() {
    this.store.dispatch(recoverPassword())
  }

  ngOnInit() {
    this.form = new LoginPageForm(this.formbuilder).createForm();
    this.store.select('login').subscribe(loginState => {
      this.onIsRecoveringPassword(loginState);
      this.onIsRecoveredPassword(loginState);
      this.onIsRecoveringPasswordFail(loginState);

    })
  }

  private async onIsRecoveringPasswordFail(loginState: LoginState) {
    if(loginState.error){
      this.store.dispatch(hide());
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
      this.store.dispatch(show());
      this.authService.recoverPassword(this.form.get('mobile')?.value).subscribe(() =>{
        this.store.dispatch(recoverPasswordSuccess());
      }, error => {
        this.store.dispatch(recoverPasswordFail({error}));
      });
    }
  }
  
  private async onIsRecoveredPassword(loginState: LoginState){
    if(loginState.isRecoveredPassword){
      this.store.dispatch(hide());
      const toaster = await this.toastController.create({
        position: "bottom",
        message: "Recovery email sent",
        color: "primary"
      });
      toaster.present();
    }
  }

}
