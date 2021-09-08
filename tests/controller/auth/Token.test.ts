import request from 'supertest'
import app from '../../../src/app'
import { login, signup } from '../testUtils/authUtil'

describe('Token', () => {
  test('Token check', async () => {
    await signup('tokencheck@test.com', 'tokencheckuser', 'tokencheckpasswd')

    const token = await login('tokencheckuser', 'tokencheckpasswd')

    return request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'title',
        content: 'contentcontent',
      })
      .then((res) => {
        expect(res.status).toBe(200)
      })
  })

  test('Invalid Token', async () => {
    await signup(
      'invalidtoken@test.com',
      'invalidtokenuser',
      'invalidtokenpasswd'
    )

    const token = await login('invalidtokenuser', 'invalidtokenpasswd')

    return request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token + 'hogehoge'}`)
      .send({
        title: 'title',
        content: 'contentcontent',
      })
      .then((res) => {
        expect(res.status).toBe(401)
        expect(res.body.error.code).toBeDefined()
      })
  })

  test('Token timeout', async () => {
    await signup(
      'tokentimeout@test.com',
      'tokentimeoutuser',
      'tokentimeoutpasswd'
    )

    const token = await login('tokentimeoutuser', 'tokentimeoutpasswd')

    // advance 1 day
    const advance1day = new Date()
    advance1day.setDate(advance1day.getDate() + 1)
    const dateNowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => advance1day.getTime())

    return request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'title',
        content: 'contentcontent',
      })
      .then((res) => {
        expect(res.status).toBe(401)
        expect(res.body.error.code).toBeDefined()
      })
      .finally(() => {
        dateNowSpy.mockRestore()
      })
  })
})
