import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeycloakService } from './services/keycloak.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AppUserInfo, UserService } from './services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('front');
  platformId = inject(PLATFORM_ID)
  user : AppUserInfo | undefined
  private userSub !: Subscription

  protected keycloakService = inject(KeycloakService)

  constructor(private userService : UserService) {}

  ngOnInit(): void {
    this.userSub = this.userService.get$User().subscribe(user => 
    {
      console.log(user)
      this.user = user
    })
  }


  ngOnDestroy() : void {
    this.userSub.unsubscribe()
  }
}
