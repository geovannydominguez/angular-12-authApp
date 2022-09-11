import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';


@Injectable({
  providedIn: 'root' // Gracias a esto, no hay que proveer el servicio en ningún módulo
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() {
    // retornar un nuevo objeto, es por seguridad para evitar modificar el objeto original.
    return { ...this._usuario };
  }

  // Inyectar el servicio http
  constructor(private http: HttpClient) { }

  registro(name: string, email: string, password: string) {
    const url: string = `${this.baseUrl}/auth/new`;

    // el orden de las propiedades del objeto no importa
    const body = { name, email, password };

    // primer argumento el url
    // segundo argumento el body
    // La respuesta puede ser exitosa o puede ser error.
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        // El orden de los operadores rxjs es importante. Se ejecutan en cascada.

        // Primero almacenar los datos del Usuario
        // {ok, token} des-estructurar el objeto respuesta
        tap(({ ok, token }) => {
          if (ok) {
            // Save myToken in LocalStorage
            localStorage.setItem('myToken', token!);
          }
        }),

        // necesito hacer una mutación de los datos. Retornar solo lo necesario
        map(resp => resp.ok),

        //Atrapar el error
        catchError(err => of(err.error.msg))
      );
  }

  login(email: string, password: string) {

    const url: string = `${this.baseUrl}/auth`;

    const body = { email, password };

    // primer argumento el url
    // segundo argumento el body
    // La respuesta puede ser exitosa o puede ser error.
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        // El orden de los operadores rxjs es importante. Se ejecutan en cascada.

        // Primero almacenar los datos del Usuario
        // Aquí también podemos des-estrucutar el objeto respuesta {ok, token}, pero lo dejo así:
        tap(resp => {
          if (resp.ok) {
            // Save myToken in LocalStorage
            localStorage.setItem('myToken', resp.token!);
          }
        }),

        // necesito hacer una mutación de los datos. Retornar solo lo necesario
        map(resp => resp.ok),

        //Atrapar el error
        catchError(err => of(err.error.msg))
      );

  }

  validarToken(): Observable<boolean> {
    const url: string = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('myToken') || ''); // si localStorage.getItem('myToken') es null entonces envía string vacío ''.

    // En el segundo argumento del get(), en las opciones, Cuando la propiedad y la variable se llaman igual, puedo omitir el nombre de la propiedad
    // return this.http.get(url, {headers: headers});
    return this.http.get<AuthResponse>(url, { headers })
      .pipe(
        map(resp => { // Segun nuestro backend, llega a este punto solo cuando la respuesta es true exitosa.
          this.setLocalStorageAndUser(resp);
          return resp.ok
        }),
        catchError(err => of(false))
      );

  }

  logout() {

    // Se puede eliminar solo myToken
    //localStorage.removeItem('myToken');

    // O podemos eliminar todas las variables del sitio web
    // IMPORTANTE: Sólo elimina el localStorage del sitio web actual.
    localStorage.clear();
  }

  // Función auxilitar para evitar repetir código
  setLocalStorageAndUser(resp: AuthResponse) {
    // Save myToken in LocalStorage
    localStorage.setItem('myToken', resp.token!);
    this._usuario = {
      name: resp.name!,
      uid: resp.uid!,
      email: resp.email!
    }
  }

}
