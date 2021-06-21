import { Component } from '../engine';
import { Emitter } from './emitter';
import { Validator } from './validator';
import { EventsTypes as DefaultEvents, Events } from './events';
import { Plugin, PluginParams } from './plugin';

export class Context<EventsTypes> extends Emitter<EventsTypes & DefaultEvents> {
  id: string;
  plugins: Map<string, unknown>;
  components: Map<string, Component>;

  constructor(id: string, events: Events) {
    super(events);

    if (!Validator.isValidId(id))
      throw new Error('ID should be valid to name@0.1.0 format');

    this.id = id;
    this.plugins = new Map();
    this.components = new Map();
  }

  use<T extends Plugin, O extends PluginParams<T>>(plugin: T, options?: O) {
    if (plugin.name && this.plugins.has(plugin.name))
      throw new Error(`Plugin ${plugin.name} already in use`);

    plugin.install(this, options || {});
    this.plugins.set(plugin.name, options);
  }

  register(component: Component) {
    if (this.components.has(component.key))
      throw new Error(`Component ${component.key} already registered`);

    this.components.set(component.key, component);
    this.trigger('componentregister', component);
  }

  destroy() {
    this.trigger('destroy');
  }
}
