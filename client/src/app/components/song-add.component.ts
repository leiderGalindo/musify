import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit{
    public titulo: string;
    public song: Song;
    public identity: any;
    public token: any;
    public url: string;
    public alertMessage: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
    ){
        this.titulo = 'Crear nueva canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this. song = new Song(1,'','','','');
    }

    ngOnInit(){
        //llamar al metodo del api para sacar un artista en base de su id getArtist
    }

    onSubmit(){
        this._route.params.forEach((params: Params) => {
            let album_id = params['album'];
            this.song.album = album_id;
        });
        console.log(this.song);
        this._songService.addSong(this.token, this.song).subscribe(
            response => {
                if(!response.song){
                    this.alertMessage = 'Error en el servidor';
                }else{
                    this.alertMessage = '¡La canción se a creado correctamente!';
                    this.song = response.song;
                    
                    this._router.navigate(['./editar-tema', response.song._id]);
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