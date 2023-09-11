import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class LoginPageForm {

    private formBuilder: FormBuilder;

    constructor(formBuilder: FormBuilder){
        this.formBuilder = formBuilder;
    }

    createForm(): FormGroup {
        return this.formBuilder.group({
            mobile: ['', Validators.required],
            password: ['', Validators.required]
        });
    }
}