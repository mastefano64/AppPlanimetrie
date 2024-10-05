import { Component, NgModule } from '@angular/core';
import { GaugeModule } from 'angular-gauge';

@NgModule({
  imports: [
    GaugeModule.forRoot()
  ],
  exports: [
    GaugeModule
  ]
})
export class AppGaugeModule {}
