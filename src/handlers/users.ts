import { Request, Response } from "express-serve-static-core";

interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  username: string;
}

interface CreateUserQueryParams {
  loginAfterCreate?: boolean;
}

export function getUsers(request: Request, response: Response) {
  response.send([]);
}

export function getUserById(request: Request, response: Response) {
  response.send({});
}

export function createUser(
  request: Request<{}, {}, CreateUserDto, CreateUserQueryParams>,
  response: Response<User>
) {
  return response.status(201).send({
    id: 1,
    username: "anson",
    email: "anson@ansonthedev.com",
  });
}
