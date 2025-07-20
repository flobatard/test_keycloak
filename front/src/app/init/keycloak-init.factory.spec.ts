import { KeycloakInit } from './keycloak-initfactory';

describe('KeycloakInit', () => {
  it('should create an instance', () => {
    expect(new KeycloakInit()).toBeTruthy();
  });
});
