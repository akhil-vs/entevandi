import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private http: HttpClient) { }
  //Submit entries//
  userData(user){
    return this.http.post("http://localhost:3000/register", user)
    .subscribe(data=>console.log());
  }

  //Get all entries//
  getData(){
    return this.http.get("http://localhost:3000/get");
  }

  //Get total emp count//
  empCount(){
    return this.http.get("http://localhost:3000/empcount");
  }

  //Get all employee list//
  getAllEmps() {
    return this.http.get("http://localhost:3000/getallemps");
  }

  //Add employee//
  addEmployee(employee){
    return this.http.post("http://localhost:3000/addemp", employee)
    .subscribe(data=>console.log());
  }

  //Delete employee//
  deleteEmp(empId) {
    return this.http.delete("http://localhost:3000/deleteemp/"+empId)
    .subscribe(data=>{console.log()});
  }
}
