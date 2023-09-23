import { Component, OnInit } from '@angular/core';

import { ServersService } from '../servers.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Server } from './server-resolver.service';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css'],
})
export class ServerComponent implements OnInit {
  server: Server;
  disableEdit = true;

  constructor(
    private serversService: ServersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // this.activatedRoute.params.subscribe((params: Params) => {
    //   this.server = this.serversService.getServer(+params.id);
    // });
    this.activatedRoute.data.subscribe((data) => {
      this.server = data.server;
    });
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.disableEdit = queryParams.allowEdit === 'false';
    });
  }

  navigateToEditServer() {
    this.router.navigate(['/servers', this.server.id, 'edit'], {
      queryParamsHandling: 'preserve',
    });
    // alternatiely: this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
  }
}
