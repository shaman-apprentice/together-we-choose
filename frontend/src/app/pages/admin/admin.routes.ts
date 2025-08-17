import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../components/admin-shell/admin-shell.component').then(m => m.AdminShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'review-submitted-shared-stories' },
      {
        path: 'review-submitted-shared-stories',
        loadComponent: () => import('./review-submitted-shared-stories/review-submitted-shared-stories.page').then(m => m.ReviewSubmittedSharedStoriesPage)
      },
      {
        path: 'review-submitted-feedback',
        loadComponent: () => import('./review-submitted-feedback/review-submitted-feedback.page').then(m => m.ReviewSubmittedFeedbackPage)
      }
    ]
  }
];