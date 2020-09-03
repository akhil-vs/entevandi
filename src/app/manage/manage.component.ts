import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from '../_services/db.service';

import { MustMatch } from '../_helpers/must-match.validator';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.less']
})
export class ManageComponent implements OnInit {

  empDataForm: FormGroup;
  submitted = false;
  display: boolean = false;
  vehTypes: any[];

  selectedVeh: any;

  constructor(private formBuilder: FormBuilder, public dbService: DbService) {
    this.vehTypes = [
      {name: '2 Wheeler', code: '2w', icon: 'fa fa-motorcycle'},
      {name: '4 Wheeler', code: '4w', icon: 'fa fa-car'}
    ];
  }

  ngOnInit(): void {
    this.empDataForm = this.formBuilder.group({
      empId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      email: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      cnfPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validator: MustMatch('password', 'cnfPassword')
    });
  }

  get f() { return this.empDataForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.empDataForm.invalid) {
      return;
    }
  }

  onReset() {
    this.submitted = false;
    this.empDataForm.reset();
    this.display = false;
  }

  showModalDialog(){
    this.display = true;
  }

}
