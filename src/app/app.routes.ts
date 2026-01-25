import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./screens/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'question/:id',
    loadComponent: () => import('./screens/question/question.component').then(m => m.QuestionComponent)
  },
  {
    path: 'reward',
    loadComponent: () => import('./screens/reward/reward.component').then(m => m.RewardComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
