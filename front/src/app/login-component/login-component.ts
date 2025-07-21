import { Component, inject, OnInit } from '@angular/core';
import { KeycloakService } from '../services/keycloak.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-component',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent implements OnInit{
  readonly keycloakService = inject(KeycloakService)
  router = inject(Router)

  ngOnInit(): void {
    if (!this.keycloakService.isLoggedIn())
    {
      console.log('Redirect login')
      this.keycloakService.login()
    }
    else
    {
      console.log('Redirect')
      this.router.navigateByUrl("/home")
    }
  }
}
