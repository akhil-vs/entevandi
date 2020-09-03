import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private http: HttpClient) { }

  userData(user){
    return this.http.post("http://localhost:3000/register", user)
    .subscribe(data=>console.log());
  }
  getData(){
    return this.http.get("http://localhost:3000/get");
  }

}
