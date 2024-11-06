Feature: Create a new user
  In order to have a users in the platform
  I want to create a new user

  Scenario: A valid non existing user
    Given I send a PUT request to "/users/b29539c4-171f-42b3-be93-facb95c4f66a" with body:
    """
    {
      "id": "b29539c4-171f-42b3-be93-facb95c4f66a",
      "firstName": "John",
      "lastName": "Doe",
      "email": "jonhdoe@gmail.com",
      "password": "123456789",
      "repeatPassword": "123456789"
    }
    """
    Then the response status code should be 201
    And the response should be empty

  Scenario: An invalid non existing user
    Given I send a PUT request to "/users/b29539c4-171f-42b3-be93-facb95c4f66a" with body:
    """
    {
      "id": "b29539c4-171f-42b3-be93-facb95c4f66a",
      "firstName": "John",
      "lastName": "Doe",
      "email": "invalidemail",
      "password": "12345678",
      "repeatPassword": "12345678"
    }
    """
    Then the response status code should be 422

    Given I send a PUT request to "/users/b29539c4-171f-42b3-be93-facb95c4f66a" with body:
    """
    {
      "id": "b29539c4-171f-42b3-be93-facb95c4f66a",
      "firstName": "John",
      "lastName": "Doe",
      "email": "jonhdoe@gmail.com",
      "password": "12345678",
      "repeatPassword": "123456"
    }
    """
    Then the response status code should be 422
