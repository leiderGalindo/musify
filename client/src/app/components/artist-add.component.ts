import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
    public artist: Artist;
    public title: string;
    public identity: any;
    public token: any;
    public url: string;
    public alertMessage : any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.title= 'Crear nuevo artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this. artist = new Artist('','','');
    }

    ngOnInit(){
        console.log('artist-add.component cargado');
    }

    onSubmit(){
        console.log(this.artist);
        this._artistService.addArtist(this.token, this.artist).subscribe(
            response => {
                if(!response.artist){
                    this.alertMessage = 'Error en el servidor';
                }else{
                    this.alertMessage = '¡El artista se a creado correctamente!';
                    this.artist = response.artist;
                    this._router.navigate(['./editar-artista', response.artist._id]);
                }
            },
            error =>{
                var errorMessage = <any>error;

                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    this.alertMessage = body.message;

                    console.log(error);
                }
            }
        );
    }
}