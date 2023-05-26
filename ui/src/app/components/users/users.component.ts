import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { User } from "../../models/entities/User";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  public users: User[] = [];

  constructor(private readonly userService: UserService) {}

  async ngOnInit() {
    this.users = await this.userService.getAll();
  }
}
