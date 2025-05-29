import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Only needed for feature modules
import { 
  DxAccordionModule, 
  DxListModule, 
  DxScrollViewModule, 
  DxTextBoxModule, 
  DxButtonModule, 
  DxChartModule,
  DxChatModule, 
  DxDrawerModule,
  DxSelectBoxModule,
  DxFileUploaderModule,
} from 'devextreme-angular';



import { AppComponent } from './app.component';
import { DxHttpModule } from 'devextreme-angular/http';
import { SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, ResetPasswordFormModule, CreateAccountFormModule, ChangePasswordFormModule, LoginFormModule } from './shared/components';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { UnauthenticatedContentModule } from './unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { ChatComponent } from './pages/chat/chat.component';
import { OfficeLlmComponent } from './pages/office-llm/office-llm.component';
// import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    OfficeLlmComponent,  
  ],
  imports: [
    BrowserModule,
    DxHttpModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    ResetPasswordFormModule,
    CreateAccountFormModule,
    ChangePasswordFormModule,
    LoginFormModule,
    UnauthenticatedContentModule,
    AppRoutingModule,
    FormsModule, // ✅ required for ngModel
    DxAccordionModule, DxListModule, DxScrollViewModule, DxTextBoxModule, DxButtonModule, DxChartModule, DxChatModule,DxDrawerModule,
    DxSelectBoxModule, DxFileUploaderModule,
  ],
  providers: [
    AuthService,
    ScreenService,
    AppInfoService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Add this line to suppress the error
})
export class AppModule { }
