import React, { Component } from 'react';
import './App.scss';
import init from './editor';

export class App extends Component {
  render() {
    return (
      <div className="app">
        <div style={{ textAlign: 'left', width: '100vw', height: '70vh' }}>
          <div ref={(el) => init(el)} />
        </div>
      </div>
    );
  }
}
export default App;
