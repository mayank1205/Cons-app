import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPageForm } from './login.page.form';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;

  constructor(private router: Router, private formbuilder: FormBuilder) { }

  login(){
    this.router.navigate(['home'])
  }

  ngOnInit() {
    this.form = new LoginPageForm(this.formbuilder).createForm();
  }

}
