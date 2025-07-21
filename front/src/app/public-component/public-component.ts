import { Component, inject, OnInit } from '@angular/core';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-public-component',
  standalone: true,
  imports: [],
  templateUrl: './public-component.html',
  styleUrl: './public-component.scss'
})
export class PublicComponent implements OnInit {
  ngOnInit()
  {
    
  }
}
