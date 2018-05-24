import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ServiceWorkerModule, SwPush, SwUpdate } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(update: SwUpdate, push: SwPush, snackbar: MatSnackBar) {
    update.available.subscribe(update => {
      console.log('update available');
    });

    const snack = snackbar.open('Update Available', 'Reload');

    snack
      .onAction()
      .subscribe(() => {
        window.location.reload();
      });

    push.messages.subscribe(msg => {
      console.log('incoming message', msg);
      snackbar.open(JSON.stringify(msg));
    });

    // key is from running  web-push generate-vapid-keys
    const key = 'BORAeKURRIl3ntzIGam1InZGPdMu_Y5MgXOCNJsI5s0SACSpfPV6nyqvUM1uy3V8M4Mbvo-Z0Fc2fWZyWc39hr8';
    push.requestSubscription({ serverPublicKey: key})
      .then(pushSubscription => {
        console.log('push subscription', pushSubscription.toJSON());
      });

  }
}
