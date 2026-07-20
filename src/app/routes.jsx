import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout';
import HomePage from '../pages/Home/HomePage';
import ServicesPage from '../pages/Services/ServicesPage';
import PortfolioPage from '../pages/Portfolio/PortfolioPage';
import TrainingPage from '../pages/Training/TrainingPage';
import ContactPage from '../pages/Contact/ContactPage';
import BlogPage from '../pages/Blog/BlogPage';
import BlogPostPage from '../pages/Blog/BlogPostPage';

// Admin imports
import AdminLayout from '../shared/layouts/AdminLayout';
import LoginPage from '../pages/Admin/LoginPage';
import DashboardPage from '../pages/Admin/DashboardPage';
import ViewInquiries from '../pages/Admin/ViewInquiries';
import ManagePortfolio from '../pages/Admin/ManagePortfolio';
import ManageServices from '../pages/Admin/ManageServices';
import ManageResources from '../pages/Admin/ManageResources';
import ManageBlog from '../pages/Admin/ManageBlog';
import AdminProtectedRoute from './providers/AdminProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'portfolio',
        element: <PortfolioPage />,
      },
      {
        path: 'training',
        element: <TrainingPage />,
      },
      {
        path: 'blog',
        element: <BlogPage />,
      },
      {
        path: 'blog/:slug',
        element: <BlogPostPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'inquiries',
        element: <ViewInquiries />,
      },
      {
        path: 'portfolio',
        element: <ManagePortfolio />,
      },
      {
        path: 'services',
        element: <ManageServices />,
      },
      {
        path: 'resources',
        element: <ManageResources />,
      },
      {
        path: 'blog',
        element: <ManageBlog />,
      },
    ],
  },
]);

export default router;
