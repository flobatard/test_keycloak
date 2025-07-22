import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import Keycloak, { KeycloakTokenParsed } from 'keycloak-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { UserService, AppUserInfo } from './user.service';

export const initilizeKeycloak = (keycloakService  :KeycloakService) => 
{
    keycloakService.init()
}

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak!: Keycloak;
  private platformId = inject(PLATFORM_ID)
  private userService = inject(UserService)

  init(): Promise<boolean> {
    console.log("INIT")
    if (!isPlatformBrowser(this.platformId)) return new Promise(() => false)
    this.keycloak = new Keycloak({
      url: "http://localhost:8080",
      realm: "testapp",
      clientId: "testapp-dev"
    });

    this.keycloak.onAuthLogout = () => this.userService.deleteUser()
    this.keycloak.onAuthRefreshError = () => this.userService.deleteUser()
    this.keycloak.onAuthError = () => this.userService.deleteUser()
    this.keycloak.onAuthSuccess = () => this.onAuthSuccess()

    // to refresh the token
    setInterval(() => {
        this.keycloak.updateToken(120).then((refreshed) => {
        if (refreshed) {
            console.log('[Keycloak] Token refreshed');
        } else {
            console.log('[Keycloak] Token still valid');
        }
    }).catch(() => {
        console.error('[Keycloak] Failed to refresh token');
    });}, 10_000);

    return this.keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    }).then(authenticated => {
      console.log('[Keycloak] Authenticated:', authenticated);
      this.onAuthSuccess()
      return authenticated;
    }).catch(err => {
      console.error('[Keycloak] Init Error:', err);
      return false;
    });
  }

  login(redirectUri = undefined) {
    //console.log(this.keycloak)
    this.keycloak.login({redirectUri: redirectUri || `${environment.frontUrl}`})
  }

  logout() {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  getParsedToken() : KeycloakTokenParsed | undefined {
    return this.keycloak.idTokenParsed
  }

  getUserInfo() : any {
    return this.keycloak.userInfo
  }

  getKeycloakInstance(): Keycloak {
    return this.keycloak;
  }

  isLoggedIn(): boolean {
    return !!this.keycloak?.token;
  }

  onAuthSuccess() : void {
    if (!this.keycloak?.tokenParsed?.['email']) return
    const user : AppUserInfo = {
      email: this.keycloak.tokenParsed?.['email'] || '',
      username: this.keycloak.tokenParsed?.['username'] || ''
    }
    this.userService.setUser(user)
  }
}