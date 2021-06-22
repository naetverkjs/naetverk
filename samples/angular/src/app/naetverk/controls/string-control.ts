import { Component, Input, OnInit, Type } from '@angular/core';
import { AngularControl } from '@naetverkjs/angular-renderer';
import { Control } from '@naetverkjs/naetverk';

@Component({
  template: `<input
    type="text"
    [value]="value"
    [readonly]="readonly"
    (change)="change($event.target.value)"
  />`,
  styles: [
    `
      input {
        border-radius: 2px;
        background-color: #2c2c2c;
        padding: 2px 6px;
        color: white;
        border: 1px solid #2c2c2c;
        font-size: 90%;
        width: 140px;
        box-sizing: border-box;
        outline: none;
      }
    `,
  ],
})
export class StringComponent implements OnInit {
  @Input() value!: string;
  @Input() readonly!: boolean;
  @Input() change!: Function;
  @Input() mounted!: Function;

  ngOnInit() {
    this.mounted();
  }
}

export class StrControl extends Control implements AngularControl {
  component: Type<StringComponent>;
  props: { [key: string]: unknown };

  constructor(public emitter, public key, readonly = false) {
    super(key);

    this.component = StringComponent;
    this.props = {
      readonly,
      change: (v) => this.onChange(v),
      value: '',
      mounted: () => {
        const value = this.getData(key) ? this.getData(key) : '';
        this.setValue(value.toString());
      },
    };
  }

  onChange(val: string) {
    this.setValue(val);
    this.emitter.trigger('process');
  }

  setValue(val: string) {
    this.props.value = val;
    this.putData(this.key, this.props.value);
  }
}
