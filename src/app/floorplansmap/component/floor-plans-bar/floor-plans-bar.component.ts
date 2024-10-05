import { Component, Input, Output, EventEmitter, OnInit, OnDestroy,
     ChangeDetectionStrategy, signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

import { AppMaterialModule } from '../../../app-material.module';

import { FloorPlansOptions, TypeAlignNavbar } from '../../_model/floor-plans-options';

@Component({
    selector: 'app-floor-plans-bar',
    templateUrl: './floor-plans-bar.component.html',
    styleUrls: ['./floor-plans-bar.component.scss'],
    standalone: true,
    imports: [
      AppMaterialModule,
      NgClass, NgStyle,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorPlansBarComponent implements OnInit, OnDestroy {
  @Input() options: FloorPlansOptions;
  @Output() barcommand = new EventEmitter<string>();

  enableNavbar = signal<boolean>(false);
  enableNavbarZoom = signal<boolean>(false);
  enableNavbarPosition = signal<boolean>(false);
  enableSelectedPosition = signal<boolean>(false);
  alignNavbar = signal<TypeAlignNavbar>('top-left');

  constructor() { }

  ngOnInit(): void {
    this.enableNavbar.set(this.options.enableNavbar);
    this.enableNavbarZoom.set(this.options.enableNavbarZoom);
    this.enableNavbarPosition.set(this.options.enableNavbarPosition);
    this.enableSelectedPosition.set(this.options.enableSelectedPosition);
    this.alignNavbar.set(this.options.alignNavbar);
  }

  onCommandButton(command: string): void {
    this.barcommand.emit(command);
  }

  ngOnDestroy(): void {

  }
}
