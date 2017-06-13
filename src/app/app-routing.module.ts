import { UpdateUserPage } from './../pages/update-user/update-user.page';
import { NewUserPage } from './../pages/new-user/new-user.page';
import { UpdateConfigPage } from './../pages/update-config/update-config.page';
import { ConfigListPage } from './../pages/config-list/config-list.page';
import { CreateConfigPage } from './../pages/create-config/create-config.page';
import { HomePage } from './../pages/home-page/home.page';
import { LoginPage } from './../pages/login/login.page';
import { AuthGuard } from './../providers/auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }
  // , { path: '**', component: LoginPage, children: [] }
  , { path: 'login', component: LoginPage,  children: [] }
  // , { path: 'home', component: HomePage, canActivate: [AuthGuard], children: [] }
  , { path: 'home', component: ConfigListPage, canActivate: [AuthGuard], children: [] }
  , { path: 'modifyConf', component: UpdateConfigPage, canActivate: [AuthGuard], children: [] }
  , { path: 'newConf', component: CreateConfigPage, canActivate: [AuthGuard],  children: [] }
  , { path: 'newUser', component: NewUserPage, canActivate: [AuthGuard],  children: [] }
  , { path: 'updateUser', component: UpdateUserPage, canActivate: [AuthGuard],  children: [] }


];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
// export const ExtractRoutes = RouterModule.forChild(routes);


