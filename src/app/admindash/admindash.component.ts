import { Component, OnInit, ɵgetComponentViewDefinitionFactory } from '@angular/core';
import { DbService } from '../_services/db.service';
import { MessageService } from 'primeng/api';

interface EntryData {
  uId: String;
  date: String;
  time: String;
  vehicle: String;
  jobMode: String;
  firstName: String;
  lastName: String;
  mobile: Number;
  address1: String;
  address2: String;
  email: String;
  pickAndDrop: Boolean;
  isViewed: Boolean;
  isAssigned: Boolean;
  assignedEmp: String;
  isCompleted: Boolean;
  payMode: String;
  amount: Number;
}

@Component({
  selector: 'app-admindash',
  templateUrl: './admindash.component.html',
  styleUrls: ['./admindash.component.css'],
  providers: [MessageService]
})
export class AdmindashComponent implements OnInit {
  details = [];
  display: boolean = false;
  recent: Array<any> = [];
  inProgress: Array<any> = [];
  completed: Array<any> = [];
  employees: any = [];
  empFiltered: any = [];

  tabs = ["Recent", "In Progress", "Completed"];
  selectedUserData: EntryData = {
    uId: '',
    date: '',
    time: '',
    vehicle: '',
    jobMode: '',
    firstName: '',
    lastName: '',
    mobile: 0,
    address1: '',
    address2: '',
    email: '',
    pickAndDrop: false,
    isViewed: false,
    isAssigned: false,
    assignedEmp: '',
    isCompleted: false,
    payMode: '',
    amount: 0
  };

  constructor(
    private dbService: DbService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.dbService.getData().subscribe(data=>{
      this.details = JSON.parse(JSON.stringify(data));
      // changing vehicletype to string
      for(let i=0; i<this.details.length; i++){
        if(this.details[i].vehicle == '2w'){
          this.details[i].vehicle = 'Two Wheeler';
        } else {
          this.details[i].vehicle = 'Four Wheeler';
        }
      }
      // cahnging jobtypes to string
      for(let i=0; i<this.details.length; i++){
        if(this.details[i].jobMode == 'ser'){
          this.details[i].jobMode = 'Service';
        } else if(this.details[i].jobMode == 'rep') {
          this.details[i].jobMode = 'Repair';
        } else {
          this.details[i].jobMode = 'Service + Repair'
        }
      }
      //changing misc details to string
      for(let item of this.details){
        if(item.isViewed == false){ item.isViewed = 'No' }
        else item.isViewed = 'Yes';
        if(item.isAssigned == false){ item.isAssigned = 'No' }
        else item.isAssigned = 'Yes';
        if(item.assignedEmp == '' || item.assignedEmp == null){ item.assignedEmp = 'Not assigned' }
        // else item.assignedEmp = 'Assigned';
        if(item.isCompleted == false){ item.isCompleted = 'No' }
        else item.isCompleted = 'Yes';
        if(item.payMode == ''){ item.payMode = 'Not set' }
        else item.payMode = 'Cash/UPI';
        if(item.amount == 0){ item.amount = 'Not set' }
        else item.amount = 'Cash/UPI';
      }
      // adding items to three seperate tabs
      for(let i=0; i<this.details.length; i++){
        if(this.details[i].isViewed){
          this.recent.push(this.details[i]);
        } else
        if(this.details[i].isAssigned) {
          this.inProgress.push(this.details[i]);
        }
        else {
          this.completed.push(this.details[i]);
        }
      }
    })
    this.dbService.getAllEmps().subscribe(
      data => {
        this.employees = data;
      }
    );
  }

  showModalDialog(entryid: string){
    let empId;
    this.empFiltered = [{
      label: 'Employees',
      items: []
    }];
    this.display = true;
    let vehMode = '';
    for(let item of this.details) {
      if(item.uId == entryid) {
        this.selectedUserData = item;
        vehMode = item.vehicle;
        break;
      }
    }
    let vehType = [
      {vehCode: '2w', vehType:'Two Wheeler'},
      {vehCode: '4w', vehType:'Four Wheeler'}
    ];
    for(let veh of vehType) {
      if(vehMode == veh.vehType) {
        vehMode = veh.vehCode;
      }
    }
    for(let emp of this.employees) {
      if(vehMode == emp.vehMode) {
        this.empFiltered[0].items.push(
          {label: emp.firstName, icon: 'pi pi-fw pi-user', command:
            (event)=>{
              this.assignEmpToEntry(entryid, emp.empId);
            }
          }
        );
        }
    }
  }

  assignEmpToEntry(entryId, empId) {
    for(let entry of this.details) {
      if(entry.uId === entryId) {
        entry.assignedEmp = empId;
        let ids = {
          dataId: entryId,
          employeeId: empId
        }
        this.dbService.updateData(ids).subscribe(
          data => {
            this.messageService.add({severity:'success', summary: 'Success', detail: 'Employee assigned successfully'});
          },
          error => {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Error occured while asigning employee'});
          }
        );
        break;
      }
    }
  }

  onConfirm() {
    this.messageService.clear;
  }

  onReject() {
      this.messageService.clear;
  }

}
