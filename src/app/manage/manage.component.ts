import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from '../_services/db.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
  providers: [MessageService, ConfirmationService]
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
  test: any;

  constructor(private formBuilder: FormBuilder,
    public dbService: DbService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
    this.vehTypes = [
      {name: 'Two Wheeler', code: '2w', icon: 'fa fa-motorcycle'},
      {name: 'Four Wheeler', code: '4w', icon: 'fa fa-car'}
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
    this.getAllEmployeeData();
  }

  getAllEmployeeData() {
    this.dbService.getAllEmps().subscribe(
      data => {
        this.empData = data;
        let len = this.empData.length;
        for(let i=0; i<len; i++){
          if(this.empData[i].vehMode == '4w'){
            this.empData[i].vehMode = 'Four Wheeler';
          } else if(this.empData[i].vehMode == '2w'){
            this.empData[i].vehMode = 'Two Wheeler';
          }
        }
      },
      error => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error occured while retrieving data'});
      }
    );
  }

  get f() { return this.empDataForm.controls; }

  //Adding employees//
  onSubmit() {
    if(this.test != 'edit'){
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
      let reUserName = this.empDataForm.value['userName'].replace(/\s/g,"")
      this.empDataForm.value['userName'] = reUserName;
      this.empDataForm.value['password'] = this.empDataForm.value['userName'];
      this.submitted = true;
      // stop here if form is invalid
      if (!this.empDataForm.valid) {
        return;
      }
      this.dbService.addEmployee(this.empDataForm.value).subscribe(
        data => {
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Employee added successfully'});
        },
        error => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error occured while adding employee'});
        }
      );
      setTimeout(()=>{
        this.display = false;
      },300);
    } else {
      this.empDataForm.value['vehMode'] = this.empDataForm.value['vehMode'].code;
      let empWithId = {
        id: this.empDataForm.value['empId'],
        detail: this.empDataForm.value
      }
      this.dbService.editEmployee(empWithId).subscribe(
        data => {
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Employee updated successfully'});
        },
        error => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error occured while updating employee'});
        }
      );
    }
  }

  //Edit employees//
  editEmp(empId) {
    this.showModalDialog('edit', empId);
    this.test = 'edit';
  }

  //Showing 'employee info' dialogbox//
  showModalDialog(status, id?){
    if(status = 'add'){
      this.test = '';
      this.empDataForm.reset();
    }
    if(status = 'edit'){
      for(let i=0; i<this.empData.length; i++){
        if(this.empData[i].empId == id){
          for(let mode of this.vehTypes) {
            if(this.empData[i].vehMode == mode.name) {
              this.selectedVeh = mode;
              break;
            }
          }
          this.empDataForm.value['empId'] = this.empData[i].empId;
          this.empDataForm.get('empId').setValue(this.empData[i].empId);
          this.empDataForm.value['firstName'] = this.empData[i].firstName;
          this.empDataForm.get('firstName').setValue(this.empData[i].firstName);
          this.empDataForm.value['lastName'] = this.empData[i].lastName;
          this.empDataForm.get('lastName').setValue(this.empData[i].lastName);
          this.empDataForm.value['address1'] = this.empData[i].address1;
          this.empDataForm.get('address1').setValue(this.empData[i].address1);
          this.empDataForm.value['address2'] = this.empData[i].address2;
          this.empDataForm.get('address2').setValue(this.empData[i].address2);
          this.empDataForm.value['email'] = this.empData[i].email;
          this.empDataForm.get('email').setValue(this.empData[i].email);
          this.empDataForm.value['mobile'] = this.empData[i].mobile;
          this.empDataForm.get('mobile').setValue(this.empData[i].mobile);
          this.empDataForm.value['userName'] = this.empData[i].userName;
          this.empDataForm.get('userName').setValue(this.empData[i].userName);
          this.empDataForm.value['password'] = this.empData[i].password;
          this.empDataForm.get('password').setValue(this.empData[i].password);
        }
      }
    }
    this.display = true;
  }

  //Delete employees//
  confirmDelete(empId) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete this employee?',
        header: 'Delete confirmation',
        accept: () => {
            //Actual logic to perform a confirmation
            console.log(empId);
            this.dbService.deleteEmp(empId);
            this.messageService.add({severity:'error', summary: 'Deleted', detail: 'Employee deleted successfully'});
        }
    });
  }

  //Reseting the form//
  onReset() {
    this.submitted = false;
    this.empDataForm.reset();
    this.display = false;
    this.selectedVeh = '';
  }

  //Closing the toast//
  onReject() {
      this.messageService.clear();
  }


}
