import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './pages/main/main.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {ShareComponent} from './pages/share/share.component';
import {UserFolderComponent} from './pages/main/user/user.folder';
import {UserProfileComponent} from './pages/main/user/user.profile';
import {UserPasswordComponent} from './pages/main/user/user.password';
import {UploadFileComponent} from './pages/dashboard/upload/upload.file';
import {PendingFileComponent} from './pages/dashboard/pending/pending.file';
import {DetailComponent} from './pages/dashboard/detail/detail.component';
import {EditPermissionComponent} from './pages/main/permission/permission.edit';
import {FlowTemplateComponent} from './pages/main/flowTemplate/flow.template';
import {NewTemplateComponent} from './pages/main/flowTemplate/new.template';
import {FileCategoryComponent} from './pages/main/file/file.category';
import {RegisterCompany} from './pages/register/register.company';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.user';
import {UserSpaceComponent} from './pages/main/user/user.space';
import {AuthGuard} from './service/auth.guard';
import {Custermonitor} from './pages/main/clusterMonitor/custermonitor';
import {UserSignComponent} from './pages/main/user/user.sign';
import {UserFaceComponent} from './pages/main/user/user.face';
import {UserAuthSettingComponent} from './pages/main/user/user.authSetting';
import {UserSpecialPasswordComponent} from './pages/main/user/user.specialpassword';

const appRoutes: Routes = [
    {
        path:"",
        redirectTo:'/login',
        pathMatch:"full"
    },
    {
        path: 'login',
        component: LoginComponent,
    },{
        path: 'register',
        component: RegisterComponent,
    },
    {   path: 'company',
        component: RegisterCompany,
    },
    {path: 'share/:id', component: ShareComponent},
    {
        path: 'portal/:domain',
        component: MainComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', component: DashboardComponent},
            {path: 'uploadFile', component: UploadFileComponent},
            {path: 'uploadFile/:dictId', component: UploadFileComponent},
            {path: 'pendingFile', component: PendingFileComponent},
            {path: 'detail/:id/:dictId', component: DetailComponent},
            {path: 'editPermit', component: EditPermissionComponent},
            {path: 'fileCategory', component: FileCategoryComponent},
            {path: 'flowTpl', component: FlowTemplateComponent},
            {path: 'newTpl/:tplName', component: NewTemplateComponent},
            {path: 'newTpl', component: NewTemplateComponent},
            {path: 'userFolder', component: UserFolderComponent},
            {path: 'userProfile', component: UserProfileComponent},
            {path: 'userPassword', component: UserPasswordComponent},
            {path: 'userSpace', component: UserSpaceComponent},
            {path: 'userSign', component: UserSignComponent},
            {path: 'userFace', component: UserFaceComponent},
            {path: 'userAuth', component: UserAuthSettingComponent},
            {path: 'cluster', component: Custermonitor},
            {path: 'UserSpecialPassword', component: UserSpecialPasswordComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
    providers: []
})
export class RoutingModule {
}
