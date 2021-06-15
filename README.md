# Naetverk.js

---

[![Build Status](https://travis-ci.com/naetverkjs/naetverk.svg?branch=master)](https://travis-ci.com/naetverkjs/naetverk)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=naetverkjs_naetverk&metric=coverage)](https://sonarcloud.io/dashboard?id=naetverkjs_naetverk)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=naetverkjs_naetverk&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=naetverkjs_naetverk)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=naetverkjs_naetverk&metric=alert_status)](https://sonarcloud.io/dashboard?id=naetverkjs_naetverk)

---

#### JavaScript framework for visual programming

## Warning

Do not use this framework before version 1 is released. It is currently still in development and not all updates will be compatible.

## Introduction

**Naetverk** is a modular framework for visual programming. **Naetverk** is forked from the fantastic [rete.js](https://github.com/retejs/rete) framework,
that allows you to create node-based editor directly in the browser.

**Why a different branch?** - I have some ideas that I follow which are in conflict with the original implementation. We decided to move the individual plugins in to one mono repository to have a tighter connection between them.
They also follow the same version number on release. So it should be easier to manage your dependencies.

### Plugins

| Name                    | Version                                                                                                                                | Description                                                                                                  | Extends              | Readme / Docs                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------- | ------------------------------------------------------------------------------------------------- |
| @naetverkjs/naetverk    | [![npm](https://img.shields.io/npm/v/@naetverkjs/naetverk?label=&style=flat-square)](https://www.npmjs.com/@naetverkjs/naetverk)       | Base library that allows the creation of node-based editors for visually programming or sequential scripting | -                    | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/naetverk/README.md)          |
| @naetverkjs/connections | [![npm](https://img.shields.io/npm/v/@naetverkjs/connections?label=&style=flat-square)](https://www.npmjs.com/@naetverkjs/connections) | Plugin to render the connections between nodes                                                               | @naetverkjs/naetverk | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/area-plugin/README.md)       |
| @naetverkjs/area        | [![npm](https://img.shields.io/npm/v/@naetverkjs/area?label=&style=flat-square)](https://www.npmjs.com/@naetverkjs/area)               | Plugin to draw the network on a configurable background with limited zoom and grid snapping                  | @naetverkjs/naetverk | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/connection-plugin/README.md) |
| @naetverkjs/lifecycle   | [![npm](https://img.shields.io/npm/v/@naetverkjs/lifecycle?label=&style=flat-square)](https://www.npmjs.com/@naetverkjs/lifecycle)     | Registers additional events that can be used while working with a component                                  | @naetverkjs/naetverk | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/lifecycle-plugin/README.md)  |
| @naetverkjs/keyboard    | [![npm](https://img.shields.io/npm/v/@naetverkjs/keyboard?label=&style=flat-square)](https://www.npmjs.com/@naetverkjs/keyboard)       | Registers keyboard input and maps them to events                                                             | @naetverkjs/naetverk | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/keyboard-plugin/README.md)   |
| @naetverkjs/arrange     | [![npm](https://img.shields.io/npm/v/@naetverkjs/arrange?label=&style=flat-square)](https://www.npmjs.com/@naetverkjs/arrange)         | Rearranges the node based on their size on the board                                                         | @naetverkjs/naetverk | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/arrange-plugin/README.md)    |
| @naetverkjs/history     | [![npm](https://img.shields.io/npm/v/@naetverkjs/history?label=&style=flat-square)](https://www.npmjs.com/@naetverkjs/history)         | Plugin that adds the ability to revert actions                                                               | @naetverkjs/naetverk | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/history-plugin/README.md)    |
| @naetverkjs/selection   | [![npm](https://img.shields.io/npm/v/@naetverkjs/selection?label=&style=flat-square)](https://www.npmjs.com/@naetverkjs/selection)     | Plugin that adds the ability to multiselect nodes with a selection rectangle                                 | @naetverkjs/naetverk | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/selection-plugin/README.md)  |
| @naetverkjs/comments    | [![npm](https://img.shields.io/npm/v/@naetverkjs/comments?label=&style=flat-square)](https://www.npmjs.com/@naetverkjs/comments)       | Plugin that allows the creation of comments and groups around nodes                                          | @naetverkjs/naetverk | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/comment-plugin/README.md)    |

### Framework Renderers

| Name                         | Description                          | Extends | Readme / Docs                                                                                    |
| ---------------------------- | ------------------------------------ | ------- | ------------------------------------------------------------------------------------------------ |
| **Angular**                  |                                      |         |                                                                                                  |
| @naetverkjs/angular-renderer | Angular Module to render basic nodes |         | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/angular-renderer/README.md) |
|                              |                                      |         |                                                                                                  |
| **React**                    |                                      |         |                                                                                                  |
| @naetverkjs/react-renderer   | React Module to render basic nodes   |         | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/react-renderer/README.md)   |

## Documentation:

https://naetverkjs.github.io/documentation/
