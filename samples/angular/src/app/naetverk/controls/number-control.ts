import { Component, Input, OnInit, Type } from '@angular/core';
import { AngularControl } from '@naetverkjs/angular-renderer';
import { Control } from '@naetverkjs/naetverk';

@Component({
  template: `<input
    type="number"
    [value]="value"
    [readonly]="readonly"
    (change)="change(+$event.target.value)"
  />`,
  styles: [
    `
      input {
        border-radius: 2px;
        background-color: #2C2C2C;
        padding: 2px 6px;
        color: white;
        border: 1px solid #2C2C2C;
        font-size: 90%;
        width: 140px;
        box-sizing: border-box;
        outline: none;
      }
    `,
  ],
})
export class NumberComponent implements OnInit {
  @Input() value!: number;
  @Input() readonly!: boolean;
  @Input() change!: Function;
  @Input() mounted!: Function;

  ngOnInit() {
    this.mounted();
  }
}

export class NumControl extends Control implements AngularControl {
  component: Type<NumberComponent>;
  props: { [key: string]: unknown };

  constructor(public emitter, public key, readonly = false) {
    super(key);

    this.component = NumberComponent;
    this.props = {
      readonly,
      change: (v) => this.onChange(v),
      value: 0,
      mounted: () => {
        this.setValue(+(this.getData(key) as any) || 0);
      },
    };
  }

  onChange(val: number) {
    this.setValue(val);
    this.emitter.trigger('process');
  }

  setValue(val: number) {
    this.props.value = +val;
    this.putData(this.key, this.props.value);
  }
}
