import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import "./App.css";
import "./styles/scrollbar.css";
import Navbar from "./components/Nav";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import FaqS from "./components/FAQs/FaqS";
import Contact from "./components/Contact/Contact";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login /Login";
import ScrollToTop from "./Utls/MOVETOP/ScrollToTop";
import TermsAndConditions from "./components/TermsAndConditions/TermsAndConditions";
import PrivacyPolicy from "./components/TermsAndConditions/PrivacyPolicy";
import TicketPolicies from "./components/TermsAndConditions/TicketPolicies";
import RefundPolicies from "./components/TermsAndConditions/RefundPolicies";
// import TicketSearch from "./components/Ticket/TicketSearch";
import TicketPage from "./components/Ticket/TicketPage";
import BusSeatSelection from "./components/Ticket/BusSeatSelection";
import FeaturesPage from "./components/Home/FeaturesPage";
import Profile from "./components/Profile/Profile";
import Bookings from "./components/Bookings/Bookings";
import Blogs from "./components/Blogs/Blogs";
import BlogPost from "./components/Blogs/BlogPost";
import Support from "./components/Support/Support";
import SearchPage from "./SearchPage/SearchPage";
import BookingPage from "./Booking/BookingPage";
import GroupBookingPage from "./Booking/GroupBookingPage";
import AdminLayout from "./Admin/AdminLayout";
import BusManagement from "./Admin/BusManagement";
import OperatorManagement from "./Admin/OperatorManagement";
import RouteManagement from "./Admin/RouteManagement";
import ScheduleManagement from "./Admin/ScheduleManagement";
import CityManagement from "./Admin/CityManagement";
import AdminDashboard from "./Admin/AdminDashboard";
import Emergency from "./components/SOS-Component/Emergency";

// this is to check the role of the user
// import ProtectedRoute from "./ProtectRoutes/ProtectedRoute"
{
	/* <ProtectedRoute allowedRoles={['admin', 'operator']}>
  <Route path="/admin" element={<AdminDashboard />} />
</ProtectedRoute> */
}

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
// this is the main App component

function App() {
	const location = useLocation();

	// Condition to hide Footer on /signup or /login pages
	const shouldHideFooter =
		location.pathname === "/signup" || location.pathname === "/login";

	return (
		<AuthProvider>
			<div className='min-h-screen bg-neutral-50 custom-scrollbar'>
				<Navbar />
				<ScrollToTop /> {/* Add ScrollToTop component here */}
				<Routes>
					{/* Public Routes */}
					<Route path='/' element={<Home />} />

					<Route path='/signup' element={<Signup />} />
					<Route path='/login' element={<Login />} />
					<Route path='/searchBuses' element={<SearchPage />} />
					<Route path='/routes' element={<SearchPage />} />
					<Route path='/features' element={<FeaturesPage />} />

					<Route
						path='/termsAndConditions'
						element={<TermsAndConditions />}
					/>
					<Route path='/privacyPolicy' element={<PrivacyPolicy />} />
					<Route path='/TicketPolicies' element={<TicketPolicies />} />
					<Route path='/blogs' element={<Blogs />} />
					<Route path='/blogs/:id' element={<BlogPost />} />
					<Route path='/support' element={<Support />} />
					<Route path='/booking' element={<BookingPage />} />
<Route path='/group-booking' element={<GroupBookingPage />} />
					<Route path='/about' element={<About />} />
					<Route path='/FAQs' element={<FaqS />} />
					<Route path='/contact' element={<Contact />} />
					<Route path='/refunds' element={<RefundPolicies />} />
					<Route path='/Emergency' element={<Emergency />} />

					{/* Protected Passenger Routes */}
					<Route
						element={
							<ProtectedRoute allowedRoles={["passenger", "admin"]} />
						}
					>
						<Route path='/profile' element={<Profile />} />
						<Route path='/bookings' element={<Bookings />} />
						<Route path='/ticket/:bookingId' element={<TicketPage />} />

						<Route path='/seatSelection' element={<BusSeatSelection />} />
					</Route>

					{/* Protected Admin Routes */}
					<Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
						<Route path='/admin' element={<AdminLayout />}>
							<Route index element={<AdminDashboard />} />
							<Route path='buses' element={<BusManagement />} />
							<Route path='operators' element={<OperatorManagement />} />
							<Route path='routes' element={<RouteManagement />} />
							<Route path='schedules' element={<ScheduleManagement />} />
							<Route path='cities' element={<CityManagement />} />
						</Route>
					</Route>
				</Routes>
				{/* Conditionally render Footer */}
				{!shouldHideFooter && <Footer />}
			</div>
		</AuthProvider>
	);
}

export default App;
