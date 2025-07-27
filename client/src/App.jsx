import { useState } from 'react'
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

import './App.css'
import './index.css'; 

import Login from './components/auth/Login'
import {Routes , Route} from 'react-router-dom'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import VerifyOtp from './components/auth/VerifyOtp'
import UpdatePassword from './components/auth/UpdatePassword'

import ImageUpload from './components/Image/ImageUpload';
import AddNGO from './components/NGO/AddNGO';
import ViewNgos from './components/NGO/ViewNGOs';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import DonateForm from './components/donate/DonateForm';
import ViewDonations from './components/donate/ViewDonations';
import WeatherTicker from './components/weather/WeatherTicker';
import QuoteTicker from './components/quoteTcker/QuoteTicker';
import Profile from './components/auth/profile/Profile';
import Review from './components/reviews/Review';
import ReportBug from './components/auth/profile/ReportBug';
import Home from './components/home/Home';
import RequestHelp from './components/auth/profile/requests/RequestHelp';
import HelpRequest from './components/auth/profile/HelpRequest';
import DonateItem from './components/auth/profile/donatinons/DonateItem';


function App() {
  const [count, setCount] = useState(0)

  return (
     <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
      />
      <Navbar />
      <WeatherTicker />
      <QuoteTicker />
    <main>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-otp' element={<VerifyOtp />} />
        <Route path='/update-password' element={<UpdatePassword />} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/reviews' element={<Review/>} />
       
       <Route path='/report-bug' element={<ReportBug />} />
       
        <Route path='/image-upload' element={<ImageUpload/>} />

        <Route path='/add-ngo' element={<AddNGO />} />
        <Route path="/view-ngos" element={<ViewNgos />} />

        <Route path='/create-request' element={<RequestHelp/>} />
        <Route path='/help-requests' element={<HelpRequest/>} />

        <Route path='/donate' element={<DonateForm/>} />
        <Route path='/view-donations' element={<ViewDonations />} />

        <Route path="/donate-item" element={<DonateItem />} />

    </Routes>

    </main>
    <Footer />
    </div>
  )
}

export default App
