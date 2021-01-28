import { Component, OnInit } from '@angular/core';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit{
    public user: User;
    public title: string;
    public identity:any;
    public token: any;
    public alertMessage:any;
    public url: string;

    constructor(
        private _userService: UserService
    ){
        this.title = 'Actualizar mis datos';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('user-edit.component.ts cargado')
    }

    onSubmit(){
        this._userService.updateUser(this.user).subscribe(
            response => {
                if(!response.user){
                    this.alertMessage = 'El usuario no se ha actualizado';
                }else{
                    //this.user = response.user;
                    localStorage.setItem('identity',JSON.stringify(this.user));
                    document.getElementById("identity_name")!.innerHTML = this.user.name;

                    if(!this.filesToUpload){
                        //Redirecion

                    }else{
                        this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [],this.filesToUpload).then(
                            (result:any) => {
                                this.user.image = result.image;
                                localStorage.setItem('identity',JSON.stringify(this.user));
                                
                                let image_path = this.url+'get-image-user/'+this.user.image;
                                document.getElementById('image-logged')!.setAttribute('src', image_path);
                            }
                        );
                    }

                    this.alertMessage = 'Datos actualizados correctamente';
                }
            },
            error =>{
                var alertUpdate = <any>error;

                if(alertUpdate != null){
                    var parsedError = error.error.message;
                    this.alertMessage = parsedError;

                    console.log(error);
                }
            }
        );
    }

    public filesToUpload: Array<File>;

    fileChangeEnvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>){
        var token = this.token;

        return new Promise(function(resolve, reject){
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i = 0; i < files.length; i++){
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}