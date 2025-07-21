import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeycloakService } from './services/keycloak.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('front');
  platformId = inject(PLATFORM_ID)

  protected keycloakService = inject(KeycloakService)

  ngOnInit(): void {
  }
}
