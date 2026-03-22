import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from './Home';
import About from './About';
import Projects from './Projects';
import Courses from './Courses';
import Consultancy from './Consultancy';
import BookConsultation from './BookConsultation';
import Contact from './Contact';

import { AuthProvider } from '../context/AuthContext';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProfile from './admin/AdminProfile';
import AdminServices from './admin/AdminServices';
import AdminMessages from './admin/AdminMessages';
import AdminPublications from './admin/AdminPublications';
import AdminResearchAreas from './admin/AdminResearchAreas';
import AdminBookings from './admin/AdminBookings';
import AdminBookingDetail from './admin/AdminBookingDetail';
import AdminSettings from './admin/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public site */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/consultancy" element={<Consultancy />} />
          <Route path="/book" element={<BookConsultation />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin panel */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="publications" element={<AdminPublications />} />
          <Route path="research-areas" element={<AdminResearchAreas />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="bookings/:id" element={<AdminBookingDetail />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
