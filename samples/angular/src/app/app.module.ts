import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NaetverkModule } from '@naetverkjs/angular-renderer';

import { AppComponent } from './app.component';
import { MyNodeComponent } from './naetverk/components/node/node.component';
import { NumberComponent } from './naetverk/controls/number-control';
import { StringComponent } from './naetverk/controls/string-control';
import { NaetverkComponent } from './naetverk/naetverk.component';

@NgModule({
  declarations: [
    AppComponent,
    NaetverkComponent,
    NumberComponent,
    MyNodeComponent,
  ],
  imports: [BrowserModule, NaetverkModule],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [NumberComponent, MyNodeComponent, StringComponent],
})
export class AppModule {}
