import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import Keycloak, { KeycloakTokenParsed } from 'keycloak-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { UserService, AppUserInfo } from './user.service';

export const initilizeKeycloak = (keycloakService  :KeycloakService) => 
{
  return keycloakService.init().then(() => undefined)
}

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak!: Keycloak;
  private initialized : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  private platformId = inject(PLATFORM_ID)
  
  constructor(private userService : UserService){
    console.log("Instancié: ", this.platformId, '\n',  new Error().stack)
  }

  init(): Promise<boolean> {
    console.log("INIT")
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(false)
    }
    this.keycloak = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    });

    this.keycloak.onAuthLogout = () => this.userService.deleteUser()
    this.keycloak.onAuthRefreshError = () => this.userService.deleteUser()
    this.keycloak.onAuthError = () => this.userService.deleteUser()
    this.keycloak.onAuthSuccess = () => {console.log("On auth"); this.onAuthSuccess()}
    this.keycloak.onTokenExpired = () => this.updateToken()

    setInterval(() => console.log("Keycloak: ", this.keycloak.tokenParsed), 5000)

    return this.keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    }).then(authenticated => {
      console.log('[Keycloak] Authenticated:', authenticated);
      if (authenticated) {
        console.log("In init: ", this.keycloak?.tokenParsed)
        this.onAuthSuccess()
      }
      this.initialized.next(true)
      return authenticated;
    }).catch(err => {
      console.error('[Keycloak] Init Error:', err);
      return false;
    });
  }

  login(redirectUri = undefined) 
  {
    if (!this.initialized.getValue()) return  
    this.keycloak.login({redirectUri: redirectUri || `${environment.frontUrl}`})
  }

  logout() {
    if (!this.initialized.getValue()) return
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  getToken(): string | undefined {
    if (!this.initialized.getValue()) return
    return this.keycloak?.token;
  }

  getParsedToken() : KeycloakTokenParsed | undefined {
    if (!this.initialized.getValue()) return
    return this.keycloak.idTokenParsed
  }

  getUserInfo() : any {
    if (!this.initialized.getValue()) return
    return this.keycloak.userInfo
  }

  getKeycloakInstance(): Keycloak | undefined {
    if (!this.initialized.getValue()) return
    return this.keycloak;
  }

  isLoggedIn(): boolean {
    if (!this.initialized.getValue()) return false
    return !!this.keycloak?.token;
  }

  onAuthSuccess() : void {
    if (!this.initialized.getValue()) return
    if (!this.keycloak?.tokenParsed?.['email']) return
    
    console.log("In auth success: ", this.keycloak.tokenParsed) 
    const user : AppUserInfo = {
      email: this.keycloak.tokenParsed?.['email'] || '',
      username: this.keycloak.tokenParsed?.['username'] || ''
    }
    this.userService.setUser(user)
  }

  updateToken() : void {
    if (!this.initialized.getValue()) return
    console.log("[Keycloak] Refresh token")
    this.keycloak.updateToken().then(refreshed => {
      if (refreshed) {
            console.log('[Keycloak] Token refreshed');
        } else {
            console.log('[Keycloak] Token still valid');
        }
    })
  }

  isInitialized(){
    return this.initialized.getValue()
  }

  get$Initialized(){
    return this.initialized.asObservable()
  }
}