import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  //model:any = {};
  registerForm:FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(private accountServer:AccountService, private toastr : ToastrService,
    private fb:FormBuilder, private router:Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18); //must older than 18 can register
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender:['male'],      
      username: ["",Validators.required],
      knowAs: ["",Validators.required],
      dateOfBirth: ["",Validators.required],
      city: ["",Validators.required],
      country: ["",Validators.required],
      password: ["",[Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ["",[Validators.required,this.matchValues('password')]]
    });
    
  }

  matchValues(matchTo:string):ValidatorFn{
    return (control: AbstractControl) =>{
      return control?.value === control?.parent?.controls[matchTo].value
        ?null:{isMatching : true};
    }
  }

  register(){
    //console.log(this.registerForm.value);
    const dob= this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values = {...this.registerForm.value,dateOfBirth:dob};
    console.log(values);
    
    this.accountServer.register(values).subscribe(response =>{
      this.router.navigateByUrl('/members');
    }, error => {
      //console.log(error);
      //this.toastr.error(error.error);  
      this.validationErrors = error;
    });
    
  }

  cancel(){
    console.log("cancelled!");
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset()))
      .toISOString().slice(0,10);
  }
}