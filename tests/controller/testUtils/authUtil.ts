import request from 'supertest'
import app from '../../../src/app'

export const signup = async (
  email: string,
  username: string,
  password: string
) => {
  await request(app).post('/api/v1/auth/signup').send({
    email: email,
    username: username,
    password: password,
  })
}

export const login = async (
  username: string,
  password: string
): Promise<string> => {
  const res = await request(app).post('/api/v1/auth/login').send({
    username: username,
    password: password,
  })
  return res.body.token
}
