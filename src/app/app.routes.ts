import { Routes } from '@angular/router';

import { HomeComponent } from './component/home/home.component';
import { Page01Component } from './component/page01/page01.component';
import { Page02Component } from './component/page02/page02.component';
import { Page03Component } from './component/page03/page03.component';
import { Page04Component } from './component/page04/page04.component';
import { Page05Component } from './component/page05/page05.component';
import { Page06Component } from './component/page06/page06.component';
import { Page07Component } from './component/page07/page07.component';
import { Page08Component } from './component/page08/page08.component';
import { Page09Component } from './component/page09/page09.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'page01', component: Page01Component },
  { path: 'page02', component: Page02Component },
  { path: 'page03', component: Page03Component },
  { path: 'page04', component: Page04Component },
  { path: 'page05', component: Page05Component },
  { path: 'page06', component: Page06Component },
  { path: 'page07', component: Page07Component },
  { path: 'page08', component: Page08Component },
  { path: 'page09', component: Page09Component },
  { path: '**', redirectTo: 'home' }
];
