export enum ApiCode {
  CommonAuth = 1000,
  Login = 1,
  Signup = 2,
  Posts = 10,
  AddPost = 11,
  FindPost = 12,
  UpdatePost = 13,
  UserPost = 14,
}

export enum HttpStatus {
  Ok = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Conflict = 409,
  InternalErr = 500,
}
