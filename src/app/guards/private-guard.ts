import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild} from '@angular/router';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class PrivateGuard implements CanActivateChild {
    constructor(private router: Router, private jwtService: JwtService) {}

    canActivateChild(route: ActivatedRouteSnapshot, state:RouterStateSnapshot): any {
        if (this.jwtService.getToken()) {
            return true
        } else {
            this.router.navigate(['/'])
            return false
        }
    }
}