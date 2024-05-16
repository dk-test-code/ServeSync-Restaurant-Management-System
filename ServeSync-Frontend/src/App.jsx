import LoginForm from "./components/authentication/LoginForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeDashboard from "./components/EmployeeDashboard";
import UnauthorizedPage from "./components/authentication/UnauthorizedPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Categories from "./components/menu_management/Categories";
import FoodItems from "./components/menu_management/FoodItems";
import Tables from "./components/table_management/Tables";
import TakeOrder from "./components/order_management/TakeOrder";
import AdminDashboard from "./components/AdminDashboard";
import MenuPage from "./components/order_management/MenuPage";
import GenerateBill from "./components/order_management/GenerateBill";
import Employees from "./components/user_management/Employees";
import Payments from "./components/bill_management/Payments";
import PendingOrders from "./components/order_management/PendingOrders";
import Reservation from "./components/reservation/Reservation";
import Home from "./components/customer/CustomerNavBar";
import ReserveTable from "./components/customer/ReserveTable";
import CheckReservationStatus from "./components/customer/CheckReservationStatus";
function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reserve-table" element={<ReserveTable />} />
        <Route
          path="/check-reservation-status"
          element={<CheckReservationStatus />}
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/take-order" element={<TakeOrder />} />
        <Route path="/employee/take-order/menu" element={<MenuPage />} />
        <Route path="/employee/generate-bill" element={<GenerateBill />} />
        <Route path="/employee/pending-orders" element={<PendingOrders />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/admin/food-items" element={<FoodItems />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/payments" element={<Payments />} />
        <Route path="/admin/tables" element={<Tables />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/reservations" element={<Reservation />} />
      </Routes>
    </Router>
  );
}

export default App;
