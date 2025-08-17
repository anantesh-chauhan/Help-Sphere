import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import './index.css';

import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import WeatherTicker from './components/weather/WeatherTicker';
import QuoteTicker from './components/quoteTcker/QuoteTicker';

import Home from './components/home/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyOtp from './components/auth/VerifyOtp';
import UpdatePassword from './components/auth/UpdatePassword';
import Profile from './components/auth/profile/Profile';
import Review from './components/reviews/Review';
import ReportBug from './components/auth/profile/ReportBug';

import ImageUpload from './components/Image/ImageUpload';
import AddNGO from './components/NGO/AddNGO';
import ViewNgos from './components/NGO/ViewNGOs';

import DonateForm from './components/donate/DonateForm';
import ViewDonations from './components/donate/ViewDonations';
import DonateItem from './components/auth/profile/donatinons/DonateItem';
import Donations from './components/auth/profile/donatinons/Donations';

import RequestHelp from './components/auth/profile/requests/RequestHelp';
import HelpRequest from './components/auth/profile/HelpRequest';
import FriendsHub from './components/frineds/FriendsHub';
import ChatPage from './components/frineds/ChatPage';

// import ChatPage from './components/frineds/chat/ChatPage';
// import ChatWindow from './components/frineds/ChatWindow';





function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Navbar */}
      <Navbar />

      {/* Tickers */}
      <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0">
        <WeatherTicker />
        <QuoteTicker />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reviews" element={<Review />} />
          <Route path="/report-bug" element={<ReportBug />} />

          <Route path="/image-upload" element={<ImageUpload />} />
          <Route path="/add-ngo" element={<AddNGO />} />
          <Route path="/view-ngos" element={<ViewNgos />} />

          <Route path="/create-request" element={<RequestHelp />} />
          <Route path="/help-requests" element={<HelpRequest />} />

          <Route path="/donate" element={<DonateForm />} />
          <Route path="/view-donations" element={<ViewDonations />} />
          <Route path="/donate-item" element={<DonateItem />} />
          <Route path="/donations" element={<Donations />} />

          <Route path="/friends" element={<FriendsHub />} />

          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:friendId" element={<ChatPage />} />
          {/* <Route path="/chat/:friendId" element={<ChatWindow/>} /> */}
        </Routes>
      </main>
npi
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
