import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import Keycloak, { KeycloakTokenParsed } from 'keycloak-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface AppUserInfo {
    email: string
    username: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
    $user : BehaviorSubject<AppUserInfo | undefined> = new BehaviorSubject<AppUserInfo | undefined>(undefined)

    setUser(user : AppUserInfo)
    {
        this.$user.next(user)
    }

    deleteUser()
    {
        this.$user.next(undefined)
    }

    get$User() : Observable<AppUserInfo | undefined>
    {
        return this.$user.asObservable()
    }

}