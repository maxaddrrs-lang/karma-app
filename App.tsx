import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CampaignProvider } from './context/CampaignContext';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { ApiConfigProvider } from './context/ApiConfigContext';
import { LanguageProvider } from './context/LanguageContext';
import { SupportChatProvider } from './context/SupportChatContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { NotificationPermissionProvider } from './context/NotificationPermissionContext';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignsListPage from './pages/CampaignsListPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import KarmaClubPage from './pages/KarmaClubPage';
import ProfilePage from './pages/ProfilePage';
import DonationBalancePage from './pages/DonationBalancePage';
import LeaguesPage from './pages/LeaguesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CreateCampaignOptionsPage from './pages/CreateCampaignOptionsPage';
import AboutUsPage from './pages/AboutUsPage';
import PartnersPage from './pages/PartnersPage';
import SupportChatPage from './pages/SupportChatPage';
import NewsPage from './pages/NotificationsPage'; // Repurposed page
import NotFoundPage from './pages/NotFoundPage';
import CreatorLoginPage from './pages/CreatorLoginPage';
import CreatorDashboardPage from './pages/CreatorDashboardPage';


const AppRoutes: React.FC = () => {
  const { isLeaguesEnabled } = useSettings();
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/creator/login" element={<CreatorLoginPage />} />
      <Route 
        path="/creator/dashboard" 
        element={
          <ProtectedRoute>
            <CreatorDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/admin/edit-campaign/:id" 
        element={
          <AdminProtectedRoute>
            <CreateCampaignPage />
          </AdminProtectedRoute>
        } 
      />
       <Route 
        path="/create-options" 
        element={
          <ProtectedRoute>
            <CreateCampaignOptionsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create" 
        element={
          <ProtectedRoute>
            <CreateCampaignPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/karma-club" 
        element={
          <ProtectedRoute>
            <KarmaClubPage />
          </ProtectedRoute>
        } 
      />
       <Route path="/news" element={<NewsPage />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
       <Route 
        path="/support" 
        element={
          <ProtectedRoute>
            <SupportChatPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/donation-balance" 
        element={
          <ProtectedRoute>
            <DonationBalancePage />
          </ProtectedRoute>
        } 
      />
      {isLeaguesEnabled && (
        <Route 
          path="/leagues" 
          element={
            <ProtectedRoute>
              <LeaguesPage />
            </ProtectedRoute>
          } 
        />
      )}
      <Route 
        path="/leaderboard"
        element={
            <ProtectedRoute>
                <LeaderboardPage />
            </ProtectedRoute>
        }
      />
      <Route path="/campaigns" element={<CampaignsListPage />} />
      <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/partners" element={<PartnersPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}


const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ApiConfigProvider>
          <LanguageProvider>
            <NotificationPermissionProvider>
              <CampaignProvider>
                <SupportChatProvider>
                  <NotificationsProvider>
                    <HashRouter>
                      <div className="flex flex-col min-h-screen antialiased">
                        <Header />
                        <main className="flex-grow pb-24">
                          <AppRoutes />
                        </main>
                        <BottomNav />
                      </div>
                    </HashRouter>
                  </NotificationsProvider>
                </SupportChatProvider>
              </CampaignProvider>
            </NotificationPermissionProvider>
          </LanguageProvider>
        </ApiConfigProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;