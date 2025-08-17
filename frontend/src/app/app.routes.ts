import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { FeedbackPage } from './pages/feedback/feedback.page';
import { ShareYourStoryPage } from './pages/share-your-story/share-your-story.page';
import { ImpressumPage } from './pages/impressum/impressum.page';
import { PrivacyPolicyPage } from './pages/privacy-policy/privacy-policy.page';
import { adminAuthGuard } from './pages/admin/admin-auth.guard';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'feedback', component: FeedbackPage },
  { path: 'share', component: ShareYourStoryPage },
  { path: 'impressum', component: ImpressumPage },
  { path: 'privacy-policy', component: PrivacyPolicyPage },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/admin-login/admin-login.page').then(m => m.AdminLoginPage)
  },
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.adminRoutes)
  },
  { path: '**', redirectTo: '' }
];
