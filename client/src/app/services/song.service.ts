import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Song } from '../models/song';

@Injectable()
export class SongService{
    public url: string;
    
    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getSongs(token: any, albumId= null): Observable<any>{
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        if(albumId == null){
            return this._http.get(this.url+'songs/', {headers: headers});
        }else{
            return this._http.get(this.url+'songs/'+albumId, {headers: headers});
        }
    }

    getSong(token: any, id: string): Observable<any>{
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url+'song/'+id, {headers: headers});
    }

    addSong(token: any, song: Song): Observable<any>{
        let json = JSON.stringify(song);
        let params = json;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url+'song', params, {headers: headers});
    }

    editSong(token: any, id: string, song: Song): Observable<any>{
        let params = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url+'song/'+id, params, {headers: headers});

    }

    deleteSong(token: any, id: string): Observable<any>{
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url+'song/'+id, {headers: headers});
    }

}