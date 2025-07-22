import { Component, Inject, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';
import { AppUserInfo, UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent implements OnInit {
  user : AppUserInfo | undefined
  private userSub !: Subscription

  constructor(private userService : UserService, private keycloakService : KeycloakService){}

  ngOnInit(): void {
    this.userSub = this.userService.get$User().subscribe(user => this.user = user)
  }

  logout()
  {
    this.keycloakService.logout()
  }

  ngOnDestroy()
  {
    this.userSub.unsubscribe()
  }
}
