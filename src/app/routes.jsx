import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout';
import HomePage from '../pages/Home/HomePage';
import ServicesPage from '../pages/Services/ServicesPage';
import PortfolioPage from '../pages/Portfolio/PortfolioPage';
import ProjectDetailPage from '../pages/Portfolio/ProjectDetailPage';
import TrainingPage from '../pages/Training/TrainingPage';
import ResourcesPage from '../pages/Training/ResourcesPage';
import AboutPage from '../pages/About/AboutPage';
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
import ManageTestimonials from '../pages/Admin/ManageTestimonials';
import AdminProtectedRoute from './providers/AdminProtectedRoute';
import ErrorPage from '../pages/Error/ErrorPage';

// Feedback & Testimonials imports
import ClientFeedbackPage from '../pages/Feedback/ClientFeedbackPage';
import StudentFeedbackPage from '../pages/Feedback/StudentFeedbackPage';
import TestimonialsPage from '../pages/Testimonials/TestimonialsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
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
        path: 'services/:serviceSlug',
        element: <ServicesPage />,
      },
      {
        path: 'portfolio',
        element: <PortfolioPage />,
      },
      {
        path: 'portfolio/:slug',
        element: <ProjectDetailPage />,
      },
      {
        path: 'training',
        element: <TrainingPage />,
      },
      {
        path: 'training/:courseSlug',
        element: <TrainingPage />,
      },
      {
        path: 'training/resources',
        element: <ResourcesPage />,
      },
      {
        path: 'resources',
        element: <Navigate to="/training/resources" replace />,
      },
      {
        path: 'about',
        element: <AboutPage />,
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
      {
        path: 'feedback/client',
        element: <ClientFeedbackPage />,
      },
      {
        path: 'feedback/student',
        element: <StudentFeedbackPage />,
      },
      {
        path: 'reviews',
        element: <TestimonialsPage />,
      },
      {
        path: 'testimonials',
        element: <Navigate to="/reviews" replace />,
      },
      {
        path: 'feedback',
        element: <Navigate to="/feedback/client" replace />,
      },
      {
        path: '*',
        element: <ErrorPage />,
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
      {
        path: 'testimonials',
        element: <ManageTestimonials />,
      },
    ],
  },
]);

export default router;
