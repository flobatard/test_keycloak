import { Component, inject, OnInit } from '@angular/core';
import { KeycloakService } from '../services/keycloak.service';

@Component({
  selector: 'app-private-component',
  standalone: true,
  imports: [],
  templateUrl: './private-component.html',
  styleUrl: './private-component.scss'
})
export class PrivateComponent implements OnInit {


  constructor(private keycloakService : KeycloakService){}

  ngOnInit()
  {
    console.log(this.keycloakService.getToken())
  }

  printKeyCloak()
  {
    console.log(this.keycloakService.getParsedToken())
  }
}
