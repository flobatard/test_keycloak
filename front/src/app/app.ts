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
  user : AppUserInfo | undefined = undefined
  private userSub !: Subscription

  keycloakInit : boolean = false
  private keyclaokInitSub !: Subscription

  constructor(private userService : UserService, private keycloakService : KeycloakService) {
  }

  ngOnInit(): void {
    this.keycloakService.init()
    //this.userSub = this.userService.get$User().subscribe(user => 
    //{
    //  console.log("User: ", user)
    //  this.user = user
    //})

    this.keyclaokInitSub = this.keycloakService.get$Initialized().subscribe(init => 
      this.keycloakInit = init
    )
  }


  ngOnDestroy() : void {
    this.userSub.unsubscribe()
    this.keyclaokInitSub.unsubscribe()
  }
}
