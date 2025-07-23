import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import Keycloak, { KeycloakTokenParsed } from 'keycloak-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak !: Keycloak;
  private $initialized : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  private $token : BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined)
  private $parsedToken : BehaviorSubject<KeycloakTokenParsed | undefined> = new BehaviorSubject<any>(undefined)
  private platformId = inject(PLATFORM_ID)
  
  constructor(){
    console.log("Instancié: ", this.platformId, '\n',  new Error().stack)
  }

  init(): Promise<boolean> {
    console.log("INIT")
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(false)
    }
    if (this.isInitialized()) return Promise.resolve(false)
    this.keycloak = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    });

    this.keycloak.onAuthLogout = () => this.updateData()
    this.keycloak.onAuthRefreshError = () => this.updateData()
    this.keycloak.onAuthError = () => this.updateData()
    this.keycloak.onAuthSuccess = () => this.onAuthSuccess()
    this.keycloak.onTokenExpired = () => this.updateToken()

    setInterval(() => console.log("Keycloak: ", this.keycloak?.tokenParsed), 5000)

    console.log("Path: ",  window.location.origin + '/keycloak/silent-check-sso.html')

    return this.keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri: window.location.origin + '/keycloak/silent-check-sso.html'
    }).then(authenticated => {
      console.log('[Keycloak] Authenticated:', authenticated);
      if (authenticated) {
        console.log("In init: ", this.keycloak?.tokenParsed)
        this.onAuthSuccess()
      }
      this.$initialized.next(true)
      return authenticated;
    }).catch(err => {
      console.error('[Keycloak] Init Error:', err);
      return false;
    });
  }

  updateData()
  {
    if (this.keycloak.authenticated)
    {
      this.$token.next(this.keycloak.token)
      this.$parsedToken.next(this.keycloak.tokenParsed)
    }
    else
    {
      this.$token.next(undefined)
      this.$parsedToken.next(undefined)
    }
  }

  login(redirectUri = undefined) 
  {
    if (!this.isInitialized()) return  
    this.keycloak.login({redirectUri: redirectUri || `${environment.frontUrl}`})
  }

  logout() {
    if (!this.isInitialized()) return
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  getToken(): string | undefined {
    if (!this.isInitialized()) return
    return this.keycloak?.token;
  }

  getParsedToken() : KeycloakTokenParsed | undefined {
    if (!this.isInitialized()) return
    return this.keycloak.idTokenParsed
  }

  get$Token() : Observable<string | undefined> {
    return this.$token.asObservable()
  }

  get$ParsedToken() : Observable<KeycloakTokenParsed | undefined> {
    return this.$parsedToken.asObservable()
  }

  getUserInfo() : any {
    if (!this.isInitialized()) return
    return this.keycloak.userInfo
  }

  getKeycloakInstance(): Keycloak | undefined {
    if (!this.isInitialized()) return
    return this.keycloak;
  }

  isLoggedIn(): boolean {
    if (!this.isInitialized()) return false
    return !!this.keycloak?.token;
  }

  onAuthSuccess() : void {
    if (!this.isInitialized()) return
    if (!this.keycloak?.tokenParsed?.['email']) return
    
    console.log("In auth success: ", this.keycloak.tokenParsed) 
    
    this.updateData()
  }

  updateToken() : void {
    if (!this.isInitialized()) return
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
    console.log("Is intitialized: ", this.$initialized.getValue())
    return this.$initialized.getValue()
  }

  get$Initialized(){
    return this.$initialized.asObservable()
  }
}