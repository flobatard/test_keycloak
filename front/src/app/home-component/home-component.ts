import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent {
  private keycloakService = inject(KeycloakService)

  logout()
  {
    this.keycloakService.logout()
  }
}
