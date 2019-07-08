import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  { path: 'login',
   loadChildren: './login/login.module#LoginPageModule' 
  },
  { path: 'profil', 
  loadChildren: './profil/profil.module#ProfilPageModule' 
  },
  { 
    path: 'planning',
   loadChildren: './planning/planning.module#PlanningPageModule' 
  },
  { 
    path: 'list',
    loadChildren: './list/list.module#ListPageModule' 
  },
  { 
    path: 'job', 
  loadChildren: './job/job.module#JobPageModule' 
  },
  { 
    path: 'profil-modale',
   loadChildren: './profil-modale/profil-modale.module#ProfilModalePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
