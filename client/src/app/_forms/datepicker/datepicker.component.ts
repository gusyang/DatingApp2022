import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements ControlValueAccessor {
  @Input() label:string;
  @Input() maxDate: Date;
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(@Self() public ngControl:NgControl) {
    this.ngControl.valueAccessor = this;
    this.bsConfig = {
      containerClass:'theme-red',
      dateInputFormat:'DD MMMM YYYY'
    } }
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  get control():FormControl{
    return this.ngControl.control as FormControl;
  }

}
