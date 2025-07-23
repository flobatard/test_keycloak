import { inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import Keycloak, { KeycloakTokenParsed } from 'keycloak-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export interface AppUserInfo {
    email: string
    username: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy{
    $user : BehaviorSubject<AppUserInfo | undefined> = new BehaviorSubject<AppUserInfo | undefined>(undefined)
    keycloakTokenSub !: Subscription

    //constructor(private keycloakService : KeycloakService){
//
    //    this.keycloakTokenSub = this.keycloakService.get$ParsedToken().subscribe(parsedToken => {
    //        if (!parsedToken) {
    //            this.$user.next(undefined)
    //            return
    //        }
    //        const user : AppUserInfo = {
    //            email: parsedToken?.['email'] || '',
    //            username: parsedToken?.['username'] || ''
    //        }
    //        this.$user.next(user) 
    //    })
    //}

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

    ngOnDestroy(): void {
        
    }

}