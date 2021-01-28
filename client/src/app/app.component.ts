import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from './services/global';
import { UserService } from './services/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit{
  public title = 'MUSIFY';
  public user: User;
  public userRegister: User;
  public identity: any;
  public token: any;
  public errorMessage: any;
  public alertRegister: any;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.userRegister = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit(){
    console.log(this.user);

    //consegir los datos del usuario identificado
    this._userService.signUp(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;
        
        if(!this.identity._id){
          alert('El usuario no está correctamente identificado');
        }else{
          //crear elemento en el localstorage para tener al usuario sesión
          localStorage.setItem('identity', JSON.stringify(identity));

          //conseguir el token para enviarselo a cada peticion http
          this._userService.signUp(this.user, "true").subscribe(
            response => {
              let token = response.token;
              this.token = token;
              
              if(this.token.length <= 0){
                alert('El token no se ha generado correctamente');
              }else{
                //crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token', token);

                this.user = new User('','','','','','ROLE_USER','');
              }
            },
            error => {
              var errorMessage = <any>error;
      
              if(errorMessage != null){
                var parsedError = error.error.message;
                this.errorMessage = parsedError;
      
                console.log(error);
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null){
          var parsedError = error.error.message;
          this.errorMessage = parsedError;

          console.log(error);
        }
      }
    );
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;

    this._router.navigate(['/']);
  }

  onSubmitRegister(){
    console.log(this.userRegister);

    this._userService.register(this.userRegister).subscribe(
      response => {
        let user  = response.user;
        this.userRegister = user;

        if(!user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se a realizado correctamente identificate con '+this.userRegister.email;
          this.userRegister = new User('','','','','','ROLE_USER','');
        }
      },
      error => {
        var alertRegister = <any>error;

        if(alertRegister != null){
          var parsedError = error.error.message;
          this.alertRegister = parsedError;

          console.log(error);
        }
      }
    );
  }

  

}
