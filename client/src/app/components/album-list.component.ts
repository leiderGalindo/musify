import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
    selector: 'album-list',
    templateUrl: '../views/album-list.html',
    providers: [UserService, AlbumService]
})

export class AlbumListComponent implements OnInit{
    public title: string;
    public albums: Album[];
    public identity: any;
    public token: any;
    public url: string;
    public confirmado: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService
    ){
        this.title= 'Albums';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.albums = [];
    }

    ngOnInit(){
        //consegiremos el listado de albums
        this.getAlbums();
    }

    getAlbums(){
        this._route.params.forEach((params: Params) => {

            this._albumService.getAlbums(this.token).subscribe(
                response => {
                    if(!response.albums){
                        this._router.navigate(['/']);
                    }else{
                        this.albums = response.albums;
                    }
                },
                error =>{
                    var errorMessage = <any>error;

                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        //this.alertMessage = body.message;

                        console.log(error);
                    }
                }
            );
        });
    }

    onDeleteConfirm(id: any){
        this.confirmado = id;
    }

    onCancelAlbum(){
        this.confirmado = null;
    }

    onDeleteAlbum(id: any){
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response =>{
                if(!response.album){
                    alert('Error en el servidor');
                }
                this.getAlbums();
            },
            error => {
                var errorMessage = <any>error;

                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    //this.alertMessage = body.message;

                    console.log(error);
                }
            }
        );
    }
}