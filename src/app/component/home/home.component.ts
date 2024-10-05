import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NavComponent } from '../nav/nav.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [
      NavComponent
    ]
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}
