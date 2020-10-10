import { Control } from '@naetverkjs/naetverk';
import React from 'react';

class NumControl extends Control {
  static component = ({ value, onChange }) => (
    <input
      type="number"
      value={value}
      ref={(ref) => {
        ref && ref.addEventListener('pointerdown', (e) => e.stopPropagation());
      }}
      onChange={(e) => onChange(+e.target.value)}
    />
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.render = 'react';

    this.component = NumControl.component;

    this.props = {
      value: '',
      onChange: (v) => {
        this.setValue(v), emitter.trigger('process');
      },
      readonly,
      mounted: () => this.setValue(this.getData(this.key)),
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}

export default NumControl;
