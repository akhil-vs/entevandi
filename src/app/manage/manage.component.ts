import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from '../_services/db.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.less'],
  providers: [MessageService]
})
export class ManageComponent implements OnInit {

  empDataForm: FormGroup;
  submitted = false;
  display: boolean = false;
  vehTypes: any[];
  empCount;
  selectedVeh: any = '';
  selected: boolean;
  empData: any;

  constructor(private formBuilder: FormBuilder,
    public dbService: DbService,
    private messageService: MessageService) {
    this.vehTypes = [
      {name: '2 Wheeler', code: '2w', icon: 'fa fa-motorcycle'},
      {name: '4 Wheeler', code: '4w', icon: 'fa fa-car'}
    ];
  }

  ngOnInit(): void {
    this.empDataForm = this.formBuilder.group({
      empId: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      address1: ['', Validators.required],
      address2: [''],
      vehMode: ['',Validators.required],
      email: ['', Validators.required],
      userName: [''],
      password: ['']
    })
    this.dbService.empCount().subscribe(data=>{
      this.empCount = data;
    })
    this.dbService.getAllEmps().subscribe(
      data => {
        this.empData = data;
      }
    );
  }

  get f() { return this.empDataForm.controls; }

  timeOut(){
    setTimeout(()=>{
      window.location.reload();
    },900);
  }

  onSubmit() {
    if(this.selectedVeh != '' ) {
      this.selected = true;
      this.empDataForm.value['vehMode'] = this.selectedVeh.code;
    }
    else {
      this.selected = false;
    }
    if(this.empCount > 0){
      this.empDataForm.value['empId'] = 1500+this.empCount;
    } else {
      this.empDataForm.value['empId'] = 1500;
    }
    this.empDataForm.value['userName'] = this.empDataForm.value['lastName']+this.empDataForm.value['empId'];
    this.empDataForm.value['password'] = this.empDataForm.value['userName'];
    this.submitted = true;
    // stop here if form is invalid
    if (!this.empDataForm.valid) {
      return;
    }
    console.log(this.empDataForm.value);
    this.dbService.addEmployee(this.empDataForm.value);
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Employee added successfully'});
    this.timeOut();

  }

  onReset() {
    this.submitted = false;
    this.empDataForm.reset();
    this.display = false;
    this.selectedVeh = '';
  }

  onReject() {
      this.messageService.clear();
  }

  showModalDialog(){
    this.display = true;
  }

}
