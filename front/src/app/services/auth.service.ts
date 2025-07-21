import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import Keycloak, { KeycloakTokenParsed } from 'keycloak-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { KeycloakService } from './keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloakService = inject(KeycloakService);
  private platformId = inject(PLATFORM_ID)
}