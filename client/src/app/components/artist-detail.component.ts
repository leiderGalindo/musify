import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit{
    public artist: Artist;
    public albums: Album[];
    public title: string;
    public identity: any;
    public token: any;
    public url: string;
    public alertMessage : any;
    public confirmado: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ){
        this.title= 'Detalle artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this. artist = new Artist('','','');
        this.albums = [];
    }

    ngOnInit(){
        //llamar al metodo del api para sacar un artista en base de su id getArtist
        this.getArtist();
    }

    getArtist(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            
            this._artistService.getArtist(this.token, id).subscribe(
                response =>{
                    if(!response.artist){
                        this._router.navigate(['/']);
                    }else{
                        this.artist = response.artist;
                        //sacar los albums del artista

                        this._albumService.getAlbums(this.token, response.artist._id).subscribe(
                            response => {
                                if(!response.albums){
                                    this.alertMessage = 'Este artista no tiene albums';
                                }else{
                                    this.albums = response.albums;
                                }
                            },
                            error => {
                                var errorMessage = <any>error;
            
                                if(errorMessage != null){
                                    var body = JSON.parse(error._body);
                                    //this.alertMessage = body.message;
            
                                    console.log(error);
                                }
                            }
                        )
                    }
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
                this.getArtist();
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