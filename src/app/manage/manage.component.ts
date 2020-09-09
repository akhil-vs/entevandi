import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from '../_services/db.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

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
  // len;

  constructor(private formBuilder: FormBuilder,
    public dbService: DbService,
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
      }
    );
  }

  get f() { return this.empDataForm.controls; }



  //Setting timeout after adding an employee//
  timeOut(){
    setTimeout(()=>{
      window.location.reload();
    },900);
  }

  //Adding employees//
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
    let reUserName = this.empDataForm.value['userName'].replace(/\s/g,"")
    this.empDataForm.value['userName'] = reUserName;
    this.empDataForm.value['password'] = this.empDataForm.value['userName'];
    this.submitted = true;
    // stop here if form is invalid
    if (!this.empDataForm.valid) {
      return;
    }
    this.dbService.addEmployee(this.empDataForm.value);
    setTimeout(()=>{
      this.display = false;
    },300);
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Employee added successfully'});
    this.timeOut();
  }

  //Edit employees//
  editEmp(empId) {
    console.log(empId);
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
            this.timeOut();
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

  //Showing 'add employee' dialogbox//
  showModalDialog(){
    this.display = true;
  }

}
