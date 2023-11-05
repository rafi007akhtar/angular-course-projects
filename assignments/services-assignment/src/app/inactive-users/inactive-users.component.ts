import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UserServiceService } from "../user-service.service";

@Component({
  selector: "app-inactive-users",
  templateUrl: "./inactive-users.component.html",
  styleUrls: ["./inactive-users.component.css"],
})
export class InactiveUsersComponent implements OnInit {
  users: string[];

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    this.users = this.userService.inactiveUsers.slice();
  }

  onSetToInactive(id: number) {
    this.users = this.userService.onSetToInactive(id);
  }
}
