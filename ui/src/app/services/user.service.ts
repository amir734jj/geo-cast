import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import CrudService from "./abstracts/crud.service";
import { User } from "../models/entities/User";

@Injectable()
export class UserService extends CrudService<User> {
  constructor(private readonly http: HttpClient) {
    super();
  }

  resolveHttpClient(): HttpClient {
    return this.http;
  }

  resolveRoute(): string {
    return "user";
  }

  default(): User {
    return {} as User;
  }
}
