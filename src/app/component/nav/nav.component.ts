import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { AppMaterialModule } from '../../app-material.module';

@Component({
  standalone: true,
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  imports: [
    AppMaterialModule,
    RouterOutlet,
    RouterLink
  ],
})
export class NavComponent {

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}
