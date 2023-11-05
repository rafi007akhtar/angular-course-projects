import { Component, OnInit } from "@angular/core";
import { UserServiceService } from "../user-service.service";

@Component({
  selector: "app-active-users",
  templateUrl: "./active-users.component.html",
  styleUrls: ["./active-users.component.css"],
})
export class ActiveUsersComponent implements OnInit {
  users: string[];

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    this.users = this.userService.activeUsers.slice();
  }

  onSetToInactive(id: number) {
    this.users = this.userService.onSetToActive(id);
  }
}
