import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{
    public album: Album;
    public songs: Song[];
    public identity: any;
    public token: any;
    public url: string;
    public alertMessage : any;
    public confirmado: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this. album = new Album('','',2017,'','');
        this. songs = [];
    }

    ngOnInit(){
        //llamar al metodo del api para sacar un artista en base de su id getArtist
        this.getAlbum();
    }

    getAlbum(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            
            this._albumService.getAlbum(this.token, id).subscribe(
                response =>{
                    if(!response.album){
                        this._router.navigate(['/']);
                    }else{
                        this.album = response.album;
                        //sacar las canciones del album

                        this.getSong(response.album._id);
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

    getSong(albumId: any){
        this._songService.getSongs(this.token, albumId).subscribe(
            response => {
                if(!response.songs){
                    this.alertMessage = 'Este album no tiene canciones';
                }else{
                    this.songs = response.songs;
                }
            },
            error => {
                var errorMessage = <any>error;

                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    console.log(error);
                }
            }
        );
    }

    onDeleteConfirm(id: any){
        this.confirmado = id;
    }

    onCancelSong(){
        this.confirmado = null;
    }

    onDeleteSong(id: any){
        this._songService.deleteSong(this.token, id).subscribe(
            response =>{
                if(!response.song){
                    alert('Error en el servidor');
                }
                this.getAlbum();
            },
            error => {
                var errorMessage = <any>error;

                if(errorMessage != null){
                    var body = JSON.parse(error._body);

                    console.log(error);
                }
            }
        );
    }

    startPlayer(song: any){
        let song_Player = JSON.stringify(song);
        let file_path = this.url + 'get-song-file/'+ song.file;
        let image_path = this.url + 'get-image-album/'+ song.album.image;

        localStorage.setItem('sound_song', song_Player);

        document.getElementById("mp3-source")?.setAttribute("src", file_path);
        (document.getElementById("player") as any).load();
        (document.getElementById("player") as any).play();

        (document.getElementById("play-song-title") as any).innerHTML = song.name;
        (document.getElementById("play-song-artist") as any).innerHTML = song.album.artist.name;
        document.getElementById("play-image-album")?.setAttribute('src', image_path);
    }

   
}