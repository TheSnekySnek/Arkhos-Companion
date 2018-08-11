import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MbPage } from './mb';

@NgModule({
  declarations: [
    MbPage,
  ],
  imports: [
    IonicPageModule.forChild(MbPage),
  ],
})
export class MbPageModule {}
