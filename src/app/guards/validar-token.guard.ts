import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(): Observable<boolean> | boolean {
    console.log('canActivate');

    return this.authService.validarToken()
      .pipe(
        tap(resp => {
          if (!resp) {
            this.router.navigateByUrl('/auth');
          }
        })
      );
  }
  canLoad(): Observable<boolean> | boolean {
    console.log('canLoad');

    return this.authService.validarToken()
      .pipe(
        tap(resp => {
          if (!resp) {
            this.router.navigateByUrl('/auth');
          }
        })
      );
  }
}
