import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { Ng5BreadcrumbModule, BreadcrumbService } from "ng5-breadcrumb";
import { Ng2DeviceDetectorModule } from "ng2-device-detector";
import { CountdownModule } from "ngx-countdown";
import "hammerjs";
import {
  ConfirmationService,
  JasperoConfirmationsModule
} from "@jaspero/ng-confirmations";
import { AlertsService, JasperoAlertsModule } from "@jaspero/ng-alerts";
import { TreeModule } from "../lib/tree/angular-tree-component";
import { NgxEchartsModule } from "ngx-echarts";
import { HttpClientModule,HttpClient } from "@angular/common/http";
import { ReversePipe } from "ngx-pipes";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { BreadcrumbModule, CheckboxModule } from "primeng/primeng";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MatFormFieldModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatStepper,
  MatPaginatorIntl
} from "@angular/material";
import { MenuToggleModule } from "./component/menu/menu-toggle.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.user";
import { ForgotPasswordComponent } from "./pages/session/forgot-password/forgot.password";
import { LockScreenComponent } from "./pages/session/lockscreen/lockscreen.component";
import { MainComponent } from "./pages/main/main.component";
import { ShareComponent } from "./pages/share/share.component";
import { UploadLogoComponent } from "./pages/dashboard/upload/upload.logo";
import { UploadFileComponent } from "./pages/dashboard/upload/upload.file";
import { PendingFileComponent } from "./pages/dashboard/pending/pending.file";
import { DetailComponent } from "./pages/dashboard/detail/detail.component";
import { EditPermissionComponent } from "./pages/main/permission/permission.edit";
import { FlowTemplateComponent } from "./pages/main/flowTemplate/flow.template";
import { NewTemplateComponent } from "./pages/main/flowTemplate/new.template";
import { FileCategoryComponent } from "./pages/main/file/file.category";
import { UserNavComponent } from "./pages/main/user/user.nav";
import { UserFolderComponent } from "./pages/main/user/user.folder";
import { UserProfileComponent } from "./pages/main/user/user.profile";
import { UserPasswordComponent } from "./pages/main/user/user.password";
import { RegisterCompany } from "./pages/register/register.company";
import { SingleFileInfoComponent } from "./pages/dashboard/single-file-info/single-file-info.component";
import { FileUploadModule } from "../lib/file-upload";
import { ByteToMbPipe } from "./pipe/byteToMb.pipe";
import { MultipleFilesInfoComponent } from "./pages/dashboard/multiple-files-info/multiple-files-info.component";
import { FileOperatorsComponent } from "./pages/dashboard/file-operators/file-operators.component";
import { DlgCategoryComponent } from "./dialog/dialog.category";
import { DlgAuthSettingComponent } from "./dialog/dialog.authSetting";
import { DlgScopeComponent } from "./dialog/dialog.scope";
import { DlgFolderComponent } from "./dialog/dialog.folder";
import { DlgSendMailComponent } from "./dialog/dialog.sendMail";
import { DlgSignatureComponent } from "./dialog/dialog.signature";
import { DlgEditorComponent } from "./dialog/dialog.editor";
import { DlgFlowPicComponent } from "./dialog/dialog.flowPic";
import { DlgAutherizeComponent } from "./dialog/dialog.autherize";
import { LocationStrategy, PathLocationStrategy } from "@angular/common";
import { UserSpaceComponent } from "./pages/main/user/user.space";
import { AuthGuard } from "./service/auth.guard";
import { Custermonitor } from "./pages/main/clusterMonitor/custermonitor";
import { UserSignComponent } from "./pages/main/user/user.sign";
import { UserFaceComponent } from "./pages/main/user/user.face";
import { UserAuthSettingComponent } from "./pages/main/user/user.authSetting";
import { myPaginator } from "./pages/main/my-paginator";
import { ImageCropperModule } from "../lib/image-cropper/imageCropperModule";
import { FirstLetterCapitalPipe } from "./pipe/first-letter-capital.pipe";
import { DebounceClickDirective } from "./directive/debounceClick.directive";
import { DlgResetPwdComponent } from "./dialog/dialog.resetpwd";
import { DlgPermissionsComponent } from "./dialog/dialog.permissions";
import { UserSpecialPasswordComponent } from "./pages/main/user/user.specialpassword";
import { RoutingModule } from "./app.routing";


//后添加的code


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
const perfectScrollbarConfig: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    Ng2DeviceDetectorModule.forRoot(),
    RoutingModule,
    FlexLayoutModule,
    Ng5BreadcrumbModule.forRoot(),
    PerfectScrollbarModule,
    MenuToggleModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDialogModule,
    JasperoConfirmationsModule,
    JasperoAlertsModule,
    TreeModule,
    CheckboxModule,
    BreadcrumbModule,
    FileUploadModule,
    PdfViewerModule,
    NgxEchartsModule,
    CountdownModule,
    // MatStepperModule,
    ImageCropperModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  })
  ],
  declarations: [
    AppComponent,
    MainComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    LockScreenComponent,
    ShareComponent,
    UploadLogoComponent,
    UploadFileComponent,
    PendingFileComponent,
    DetailComponent,
    EditPermissionComponent,
    FlowTemplateComponent,
    NewTemplateComponent,
    FileCategoryComponent,
    UserNavComponent,
    UserFolderComponent,
    UserProfileComponent,
    UserPasswordComponent,
    RegisterCompany,
    SingleFileInfoComponent,
    DlgCategoryComponent,
    DlgAuthSettingComponent,
    DlgScopeComponent,
    DlgFolderComponent,
    DlgSendMailComponent,
    DlgSignatureComponent,
    DlgEditorComponent,
    DlgFlowPicComponent,
    DlgAutherizeComponent,
    DlgResetPwdComponent,
    DlgPermissionsComponent,
    ByteToMbPipe,
    UserSpaceComponent,
    UserSignComponent,
    UserFaceComponent,
    UserAuthSettingComponent,
    UserSpecialPasswordComponent,
    Custermonitor,
    MultipleFilesInfoComponent,
    FileOperatorsComponent,
    FirstLetterCapitalPipe,
    DebounceClickDirective
  ],
  entryComponents: [
    DlgCategoryComponent,
    DlgAuthSettingComponent,
    DlgScopeComponent,
    DlgFolderComponent,
    DlgSendMailComponent,
    DlgSignatureComponent,
    DlgEditorComponent,
    DlgFlowPicComponent,
    DlgAutherizeComponent,
    DlgResetPwdComponent,
    DlgPermissionsComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    AlertsService,
    ConfirmationService,
    ReversePipe,
    BreadcrumbService,
    AuthGuard,
    { provide: MatPaginatorIntl, useValue: myPaginator() },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: MatStepper, useValue: {} },
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileAppModule {}
