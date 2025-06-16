import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle, FaUser, FaBars, FaEdit, FaLock, FaMobileAlt, FaSignOutAlt, FaUsers, FaLaptop, FaPlane, FaHotel, FaCar
} from "react-icons/fa";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import FlightBookingHistory from "./FlightBookingHistory";
import HotelBookingHistory from "./HotelBookingHistory";
import CabBookingHistory from "./CabBookingHistory";

const numberToWords = (num) => {
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = [
    "",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["", "Thousand", "Million", "Billion"];

  if (num === 0) return "Zero";

  const convertLessThanThousand = (n) => {
    if (n === 0) return "";
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const unit = n % 10;
      return `${tens[ten]}${unit ? " " + units[unit] : ""}`;
    }
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    return `${units[hundred]} Hundred${remainder ? " " + convertLessThanThousand(remainder) : ""}`;
  };

  let words = "";
  let thousandIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk) {
      words = `${convertLessThanThousand(chunk)} ${thousands[thousandIndex]} ${words}`.trim();
    }
    num = Math.floor(num / 1000);
    thousandIndex++;
  }

  return words;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [coTravellers, setCoTravellers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [newTraveller, setNewTraveller] = useState({ name: "", relationship: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationData, setVerificationData] = useState({ identifier: "", code: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [activeSection, setActiveSection] = useState("Profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [carRentals, setCarRentals] = useState([]);
  const [historyTab, setHistoryTab] = useState("Flights");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const API_URL_LOGIN = "http://localhost:5001/api";
  const API_URL_FLIGHT = "http://localhost:5000/api";
  const API_URL_CAB = "http://localhost:5005/api";

  const statesList = [
    "Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
    "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal",
  ];

  const profileFields = [
    { label: "Name", name: "username" },
    { label: "Birthday", name: "birthday", type: "date" },
    { label: "Gender", name: "gender" },
    { label: "Address", name: "address" },
    { label: "Pincode", name: "pincode" },
    { label: "State", name: "state" },
    { label: "Email", name: "email" },
    { label: "Phone", name: "phone" },
  ];

  const isEmail = (str) => /^[\w\.-]+@[\w\.-]+\.\w+$/.test(str);
  const isPhone = (str) => /^\d{10}$/.test(str);
  const validatePincode = (str) => /^\d{6}$/.test(str);

  const calculateCompletionPercentage = (userData) => {
    const totalFields = profileFields.length;
    let filledFields = 0;
    profileFields.forEach((field) => {
      if (userData[field.name]) filledFields++;
    });
    return Math.round((filledFields / totalFields) * 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const getIdentifier = (user) => user.email || user.phone;

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type: "", visible: false }), 3000);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData({
          ...parsedUser,
          birthday: parsedUser.birthday ? new Date(parsedUser.birthday).toISOString().split("T")[0] : "",
        });
        setCompletionPercentage(calculateCompletionPercentage(parsedUser));
        fetchProfile(getIdentifier(parsedUser));
        fetchBookingHistory(parsedUser);
      } catch {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    const storedCoTravellers = localStorage.getItem("coTravellers");
    const storedDevices = localStorage.getItem("devices");
    if (storedCoTravellers) setCoTravellers(JSON.parse(storedCoTravellers));
    if (storedDevices) {
      setDevices(JSON.parse(storedDevices));
    } else {
      const currentDevice = { id: Date.now(), name: navigator.userAgent, lastLogin: new Date().toISOString(), isCurrent: true };
      setDevices([currentDevice]);
      localStorage.setItem("devices", JSON.stringify([currentDevice]));
    }
  }, [navigate]);

  const fetchProfile = async (identifier) => {
    try {
      const response = await fetch(`${API_URL_LOGIN}/profile?identifier=${encodeURIComponent(identifier)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.success) {
        const updatedUser = {
          ...res.user,
          birthday: res.user.birthday ? new Date(res.user.birthday).toISOString().split("T")[0] : "",
        };
        setUser(updatedUser);
        setFormData(updatedUser);
        setCompletionPercentage(calculateCompletionPercentage(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setError(res.error || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      setError(`Failed to load profile data: ${err.message}`);
    }
  };

  const fetchBookingHistory = async (user) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL_CAB}/bookings?user_id=${user.user_id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setCarRentals(data.bookings || []);
      } else {
        setError(data.error || "Failed to load car bookings");
      }
    } catch (err) {
      console.error("Fetch car booking history error:", err);
      setError(`Failed to load car booking history: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  const handleVerificationChange = (e) => setVerificationData({ ...verificationData, [e.target.name]: e.target.value });

  const handleAddCoTraveller = () => {
    if (!newTraveller.name || !newTraveller.relationship) {
      setError("Please fill in all traveller details");
      return;
    }
    const updatedCoTravellers = [...coTravellers, { id: Date.now(), ...newTraveller }];
    setCoTravellers(updatedCoTravellers);
    localStorage.setItem("coTravellers", JSON.stringify(updatedCoTravellers));
    setNewTraveller({ name: "", relationship: "" });
    setError("");
  };

  const handleDeleteCoTraveller = (id) => {
    const updatedCoTravellers = coTravellers.filter((t) => t.id !== id);
    setCoTravellers(updatedCoTravellers);
    localStorage.setItem("coTravellers", JSON.stringify(updatedCoTravellers));
  };

  const handleDeleteDevice = (id) => {
    const updatedDevices = devices.filter((d) => d.id !== id && !d.isCurrent);
    setDevices(updatedDevices);
    localStorage.setItem("devices", JSON.stringify(updatedDevices));
  };

  const handleSave = async () => {
    if (formData.email && !isEmail(formData.email)) {
      setError("Invalid email format");
      return;
    }
    if (formData.phone && !isPhone(formData.phone)) {
      setError("Phone number must be 10 digits");
      return;
    }
    if (formData.pincode && !validatePincode(formData.pincode)) {
      setError("Pincode must be 6 digits");
      return;
    }
    try {
      const response = await fetch(`${API_URL_LOGIN}/update_profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, identifier: getIdentifier(user) }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.success) {
        showToast("Profile updated successfully!", "success");
        localStorage.setItem("user", JSON.stringify(formData));
        setUser(formData);
        setCompletionPercentage(calculateCompletionPercentage(formData));
        setShowPopup(false);
        setError("");
        fetchProfile(getIdentifier(user));
      } else {
        setError(res.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      setError(`Failed to update profile: ${err.message}`);
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    try {
      const response = await fetch(`${API_URL_LOGIN}/change_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: getIdentifier(user), currentPassword, newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.success) {
        showToast("Password changed successfully!", "success");
        setShowPasswordPopup(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordError("");
      } else {
        setPasswordError(res.error || "Failed to change password");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setPasswordError(`Failed to change password: ${err.message}`);
    }
  };

  const handleRequestVerification = async (phone) => {
    try {
      const response = await fetch(`${API_URL_LOGIN}/request_verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: phone }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.success) {
        setVerificationData({ identifier: phone, code: "" });
        setShowVerificationPopup(true);
        setVerificationError("");
      } else {
        setError(res.error || "Failed to send verification code");
      }
    } catch (err) {
      console.error("Request verification error:", err);
      setError(`Failed to send verification code: ${err.message}`);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`${API_URL_LOGIN}/verify_code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.success) {
        showToast("Phone verified successfully!", "success");
        setShowVerificationPopup(false);
        setVerificationData({ identifier: "", code: "" });
        fetchProfile(getIdentifier(user));
      } else {
        setVerificationError(res.error || "Invalid code");
      }
    } catch (err) {
      console.error("Verify code error:", err);
      setVerificationError(`Failed to verify code: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("coTravellers");
    localStorage.removeItem("devices");
    navigate("/login");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const openEditPopup = () => setShowPopup(true);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} className="text-gray-600 text-lg">
          Loading...
        </motion.div>
      </div>
    );
  }

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white text-sm z-50 ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:hidden flex justify-between items-center p-4 bg-white shadow-md border-b border-gray-200">
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-700 hover:text-blue-600 focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaBars size={24} />
        </motion.button>
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 max-w-7xl mx-auto w-full p-4 gap-6">
        <motion.nav
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`lg:w-64 bg-white rounded-xl shadow-lg p-6 fixed inset-y-0 left-0 z-50 w-64 transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out border border-gray-100`}
        >
          <div className="flex items-center mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <FaUser className="text-blue-600 text-xl" />
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-800 truncate">{user.username}</span>
          </div>
          <ul className="space-y-2">
            {[
              { section: "Profile", label: "Profile", icon: <FaUser className="mr-2" /> },
              { section: "BookingHistory", label: "Booking History", icon: <FaPlane className="mr-2" /> },
              { section: "Login_details", label: "Login Details", icon: <FaLock className="mr-2" /> },
              { section: "coTravellersSection", label: "Co-Travellers", icon: <FaUsers className="mr-2" /> },
              { section: "devicesSection", label: "Devices", icon: <FaLaptop className="mr-2" /> },
              { section: "logoutSection", label: "Logout", icon: <FaSignOutAlt className="mr-2" />, onClick: handleLogout },
            ].map((item, index) => (
              <li key={index}>
                <motion.button
                  onClick={() => (item.onClick ? item.onClick() : handleSectionChange(item.section))}
                  variants={itemVariants}
                  className={`w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 transition ${
                    activeSection === item.section ? "bg-blue-100 text-blue-600 font-semibold" : ""
                  }`}
                  whileHover={{ x: 5 }}
                >
                  {item.icon}
                  {item.label}
                </motion.button>
              </li>
            ))}
          </ul>
        </motion.nav>

        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        <div className="flex-1 w-full lg:ml-0 mt-4 lg:mt-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeSection === "Profile" && (
              <motion.div
                key="Profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Completion</h2>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
                    />
                  </div>
                  <p className="text-sm text-gray-600">{completionPercentage}% Complete</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Personal Details</h2>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={openEditPopup}
                      className="mt-4 sm:mt-0 flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </motion.button>
                  </div>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200"
                    >
                      {error}
                    </motion.div>
                  )}
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                    {profileFields.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <span className="text-sm text-gray-600">
                          {item.name === "birthday" ? formatDate(user[item.name]) : user[item.name] || "Not provided"}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeSection === "BookingHistory" && (
              <motion.div
                key="BookingHistory"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Booking History</h2>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200"
                  >
                    {error}
                  </motion.div>
                )}
                {isLoading && <p className="text-gray-500 text-sm mb-4">Loading bookings...</p>}
                {!isLoading && (
                  <div className="flex border-b border-gray-200 mb-6">
                    {["Flights", "Hotels", "Cars"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setHistoryTab(tab)}
                        className={`px-4 py-2 text-sm font-medium ${
                          historyTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                  {historyTab === "Flights" && (
                    <FlightBookingHistory
                      user={user}
                      setError={setError}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      showToast={showToast}
                      API_URL_FLIGHT={API_URL_FLIGHT}
                      formatDate={formatDate}
                      numberToWords={numberToWords}
                    />
                  )}
                  {historyTab === "Hotels" && (
                    <HotelBookingHistory
                      user={user}
                      setError={setError}
                      formatDate={formatDate}
                      numberToWords={numberToWords}
                      fetchBookingHistory={fetchBookingHistory}
                      showToast={showToast}
                    />
                  )}
                  {historyTab === "Cars" && (
                    <CabBookingHistory
                      user={user}
                      carRentals={carRentals}
                      setCarRentals={setCarRentals}
                      fetchBookingHistory={fetchBookingHistory}
                      showToast={showToast}
                      isLoading={isLoading}
                    />
                  )}
                </motion.div>
              </motion.div>
            )}

            {activeSection === "Login_details" && (
              <motion.div
                key="Login_details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Login Details</h2>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200"
                  >
                    {error}
                  </motion.div>
                )}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-between items-center py-3 border-b border-gray-100"
                  >
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <FaMobileAlt className="mr-2 text-gray-500" />
                      Mobile Number
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">{user.phone || "Not provided"}</span>
                      {user.phone &&
                        (user.otp_verified ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => handleRequestVerification(user.phone)}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            Verify
                          </motion.button>
                        ))}
                    </div>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-between items-center py-3 border-b border-gray-100"
                  >
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <span className="text-sm text-gray-600">{user.email || "Not provided"}</span>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <FaLock className="mr-2 text-gray-500" />
                      Password
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">•••••••</span>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setShowPasswordPopup(true)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Change
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {activeSection === "coTravellersSection" && (
              <motion.div
                key="coTravellersSection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Co-Travellers</h2>
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newTraveller.name}
                      onChange={(e) => setNewTraveller({ ...newTraveller, name: e.target.value })}
                      className="border border-gray-200 rounded-lg p-3 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                    />
                    <input
                      type="text"
                      placeholder="Relationship"
                      value={newTraveller.relationship}
                      onChange={(e) => setNewTraveller({ ...newTraveller, relationship: e.target.value })}
                      className="border border-gray-200 rounded-lg p-3 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                    />
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleAddCoTraveller}
                      className="flex items-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                      <AiOutlinePlus className="mr-2" />
                      Add
                    </motion.button>
                  </div>
                  {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                </div>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                  {coTravellers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No co-travellers added yet.</p>
                  ) : (
                    coTravellers.map((traveller) => (
                      <motion.div
                        key={traveller.id}
                        variants={itemVariants}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">{traveller.name}</p>
                          <p className="text-sm text-gray-500">{traveller.relationship}</p>
                        </div>
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => handleDeleteCoTraveller(traveller.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <AiOutlineDelete size={20} />
                        </motion.button>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </motion.div>
            )}

            {activeSection === "devicesSection" && (
              <motion.div
                key="devicesSection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Devices</h2>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                  {devices.map((device) => (
                    <motion.div
                      key={device.id}
                      variants={itemVariants}
                      className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{device.name.substring(0, 50)}...</p>
                        <p className="text-sm text-gray-500">
                          Last login: {new Date(device.lastLogin).toLocaleString()}
                          {device.isCurrent && " (Current)"}
                        </p>
                      </div>
                      {!device.isCurrent && (
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => handleDeleteDevice(device.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <AiOutlineDelete size={20} />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </motion.button>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200"
                >
                  {error}
                </motion.div>
              )}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-h-[60vh] overflow-y-auto"
              >
                {profileFields.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={item.name === "address" ? "col-span-1 sm:col-span-2" : "col-span-1"}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
                    {item.name === "state" ? (
                      <select
                        name={item.name}
                        value={formData[item.name] || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                      >
                        <option value="">Select State</option>
                        {statesList.map((state, stateIndex) => (
                          <option key={stateIndex} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    ) : item.name === "gender" ? (
                      <select
                        name={item.name}
                        value={formData[item.name] || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    ) : (
                      <input
                        type={item.type || "text"}
                        name={item.name}
                        value={formData[item.name] || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
              <div className="flex justify-end">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPasswordPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPasswordPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose size={24} />
                </motion.button>
              </div>
              {passwordError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200"
                >
                  {passwordError}
                </motion.div>
              )}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                  />
                </motion.div>
              </motion.div>
              <div className="flex justify-end mt-6">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleChangePassword}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVerificationPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Verify Phone</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowVerificationPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose size={24} />
                </motion.button>
              </div>
              {verificationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200"
                >
                  {verificationError}
                </motion.div>
              )}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                  <input
                    type="text"
                    name="code"
                    value={verificationData.code}
                    onChange={handleVerificationChange}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                    placeholder="Enter OTP"
                  />
                </motion.div>
              </motion.div>
              <div className="flex justify-end mt-6">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleVerifyCode}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Verify
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;