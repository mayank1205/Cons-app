import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPageForm } from './login.page.form';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  apiError: String;

  constructor(private authService: AuthService, private router: Router, private formbuilder: FormBuilder) { }

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

  ngOnInit() {
    this.form = new LoginPageForm(this.formbuilder).createForm();
  }

}
