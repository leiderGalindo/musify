import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class UserService{
    public identity: any;
    public token: any;
    public url: string;
    
    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    signUp(user_to_login: any, gethash = ""):Observable<any>{
        if(gethash != ""){
            user_to_login.gethash = gethash;
        }
        let json = JSON.stringify(user_to_login);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});

        return this._http.post(this.url+'login', params, {headers: headers});
    }

    register(userToRegister: any):Observable<any>{
        let json = JSON.stringify(userToRegister);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});

        return this._http.post(this.url+'register', params, {headers: headers});
    }

    updateUser(userToUpdate:any):Observable<any>{
        let json = JSON.stringify(userToUpdate);
        let params = json;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.getToken()
        });

        return this._http.put(this.url+'update-user/'+userToUpdate._id, params, {headers: headers});
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity')!);

        if(identity != 'undefined'){
            this.identity = identity;
        }else{
            this.identity = null;
        }

        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');

        if(token != 'undefined'){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;
    }

}