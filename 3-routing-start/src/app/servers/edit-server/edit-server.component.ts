import { Component, OnInit } from '@angular/core';

import { ServersService } from '../servers.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CanComponentDeactivate } from 'src/app/can-deactivate.service';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css'],
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: { id: number; name: string; status: string };
  serverName = '';
  serverStatus = '';
  changesSaved = false;
  disableEdit = true;

  constructor(
    private serversService: ServersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.server = this.serversService.getServer(
      +this.activatedRoute.snapshot.params.id
    );
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.disableEdit = queryParams.allowEdit === 'false';
    });
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {
      name: this.serverName,
      status: this.serverStatus,
    });
    this.changesSaved = true;
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  canDeactivate() {
    if (this.disableEdit) {
      return true;
    }

    if (this.changesSaved) {
      return true;
    }

    if (
      this.serverName !== this.server.name ||
      this.serverStatus !== this.serverStatus
    ) {
      return confirm(
        'Looks like your changes are not saved. Are you sure you want to leave?'
      );
    }
  }
}
