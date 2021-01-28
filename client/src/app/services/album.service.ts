import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Album } from '../models/album';

@Injectable()
export class AlbumService{
    public url: string;
    
    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getAlbums(token: any, artistId = null): Observable<any>{
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        if(artistId == null){
            return this._http.get(this.url+'albums', {headers: headers});
        }else{
            return this._http.get(this.url+'albums/'+artistId, {headers: headers});
        }
    }

    getAlbum(token: any, id: string): Observable<any>{
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url+'album/'+id, {headers: headers});
    }

    addAlbum(token: any, album: Album): Observable<any>{
        let json = JSON.stringify(album);
        let params = json;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url+'album', params, {headers: headers});
    }

    editAlbum(token: any, id: string, album: Album): Observable<any>{
        let params = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url+'album/'+id, params, {headers: headers});

    }

    deleteAlbum(token: any, id: string): Observable<any>{
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url+'album/'+id, {headers: headers});
    }

}