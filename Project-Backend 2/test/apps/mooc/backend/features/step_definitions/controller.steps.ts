import { Given, Then } from '@cucumber/cucumber'
import assert from 'assert'
import request from 'supertest'
import { application } from './hooks.steps'

let _request: request.Test
let _response: request.Response

Given('I send a GET request to {string}', (route: string) => {
  _request = request(application.httpServer).get(route)
})

Then('the response status code should be {int}', async (status: number) => {
  _response = await _request.expect(status)
})

Given(
  'I send a PUT request to {string} with body:',
  (route: string, body: string) => {
    _request = request(application.httpServer).put(route).send(JSON.parse(body))
  }
)

Given(
  'I send a POST request to {string} with body:',
  (route: string, body: string) => {
    _request = request(application.httpServer)
      .post(route)
      .send(JSON.parse(body))
  }
)

Then('the response should be empty', () => {
  assert.deepStrictEqual(_response.body, {})
})

Then('the response content should not be empty', () => {
  assert.notEqual(_response.body.length, 0)
})
