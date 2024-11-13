Feature: Log in a user
  In order to use the application
  I want to log in a user

  Scenario: A valid user to login
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
    Given I send a POST request to "/auth/login" with body:
    """
    {
      "email": "jonhdoe@gmail.com",
      "password": "123456789"
    }
    """
    Then the response status code should be 200
    And the response content should not be empty
