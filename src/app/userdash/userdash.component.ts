import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from '../_services/db.service';
import { MessageService } from 'primeng/api';
import * as uuid from 'uuid';

@Component({
  selector: 'app-userdash',
  templateUrl: './userdash.component.html',
  styleUrls: ['./userdash.component.css'],
  providers: [MessageService]
})
export class UserdashComponent implements OnInit {
  test = (uuid.v4().split('-'));

  userDataForm: FormGroup;
  submitted = false;

  vehTypes: any[];
  serviceTypes: any[];

  selectedVeh: any;
  selectedSer: any;

  constructor(
    private formBuilder: FormBuilder,
    public dbService: DbService,
    private messageService: MessageService,
    ) {
    this.vehTypes = [
      {name: '2 Wheeler', code: '2w', icon: 'fa fa-motorcycle'},
      {name: '4 Wheeler', code: '4w', icon: 'fa fa-car'}
    ];
    this.serviceTypes = [
      {name: 'Service', code: 'ser', icon: 'fa fa-shower'},
      {name: 'Repair', code: 'rep', icon: 'fa fa-cogs'},
      {name: 'Service + Repair', code: 'repsev', icon: 'fa fa-plug'}
    ];
  }

  ngOnInit(): void {
    this.userDataForm = this.formBuilder.group({
      uId: [''],
      date: [''],
      time: [''],
      vehicle: [''],
      jobMode: [''],
      firstName: ['', Validators.required],
      lastName: [''],
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      address1: ['', Validators.required],
      address2: [''],
      email: ['', [Validators.email]],
      pickAndDrop: [true]
    });
  }

  get f() { return this.userDataForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userDataForm.invalid) {
      alert("Incomplete");
      return;
    }
    this.userDataForm.value['uId'] = this.test[4];
    // getting time and date and assigning to form
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = (currentDate.getMonth()+1);
    var year = currentDate.getFullYear();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var suffix = "PM";
    if(hours >= 12)
    {
      suffix = "PM";
      hours -= 12;
    }
    if(hours == 0){
      hours = 12;
    }
    var fullDate = (day+'/'+month+'/'+year);
    var fullTime = (hours+":"+minutes+" "+suffix);
    this.userDataForm.value['date'] = fullDate;
    this.userDataForm.value['time'] = fullTime;
    this.userDataForm.value['vehicle'] = this.selectedVeh.code;
    this.userDataForm.value['jobMode'] = this.selectedSer.code;

    // posting on success
    this.dbService.userData(this.userDataForm.value).subscribe(
      next => {
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Entry added successfully'});
        this.onReset();
      },
      error => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'An error occured'});
      }
    );
  }

  onReset() {
    this.submitted = false;
    this.userDataForm.reset();
    this.selectedSer = '';
    this.selectedVeh = '';
  }

  //Closing the toast//
  onReject() {
    this.messageService.clear();
  }

}
