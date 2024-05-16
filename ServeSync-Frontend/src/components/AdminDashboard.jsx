import { useState, useEffect, useMemo, useCallback } from "react";
import AdminSideBar from "./AdminSideBar";
import AdminNavBar from "./AdminNavBar";
import useAuth from "./useAuth";
import "./AdminDashboard.css"; // Import your CSS file
import axios from "axios";

const AdminDashboard = () => {
  useAuth(["admin"]);

  // State variables for counts and revenue
  const [foodItemCount, setFoodItemCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [revenueToday, setRevenueToday] = useState(0);
  const [revenueThisMonth, setRevenueThisMonth] = useState(0);

  const config = useMemo(() => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  // Function to fetch counts and revenue from the backend
  const fetchAnalytics = useCallback(async () => {
    try {
      // Fetch food item count
      const foodItemCountResponse = await axios.get(
        "http://localhost:8080/food-items/count",
        config
      );
      setFoodItemCount(foodItemCountResponse.data);

      // Fetch category count
      const categoryCountResponse = await axios.get(
        "http://localhost:8080/categories/count",
        config
      );
      setCategoryCount(categoryCountResponse.data);

      // Fetch orders count
      const orderCountResponse = await axios.get(
        "http://localhost:8080/orders/orders-placed-today",
        config
      );
      setOrdersCount(orderCountResponse.data);

      // Fetch revenue generated today
      const revenueTodayResponse = await axios.get(
        "http://localhost:8080/orders/revenue-generated-today",
        config
      );
      setRevenueToday(revenueTodayResponse.data);

      // Fetch revenue generated this month
      const revenueThisMonthResponse = await axios.get(
        "http://localhost:8080/orders/revenue-generated-this-month",
        config
      );
      setRevenueThisMonth(revenueThisMonthResponse.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  }, [config]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);
  return (
    <>
      <AdminNavBar />
      <div className="container-fluid " style={{ height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          <AdminSideBar />
          <main
            role="main"
            className="col-md-9 ml-sm-auto col-lg-10 px-4 d-flex align-items-center justify-content-center dashboard-container"
          >
            <div className="analytics-container">
              <div className="analytics-card-dashboard">
                <h2>Food Items</h2>
                <p className="count">{foodItemCount}</p>
              </div>
              <div className="analytics-card-dashboard">
                <h2>Categories</h2>
                <p className="count">{categoryCount}</p>
              </div>

              <div className="analytics-card-dashboard">
                <h2>Orders Today</h2>
                <p className="count">{ordersCount}</p>
              </div>

              <div className="analytics-card-dashboard">
                <h2>Payments Today </h2>
                <p className="count">₹ {revenueToday.toFixed(2)}</p>
              </div>
              <div className="analytics-card-dashboard">
                <h2>Payments This Month </h2>
                <p className="count">₹ {revenueThisMonth.toFixed(2)}</p>
              </div>
              {/* Add similar count display for other analytics */}
            </div>
            {/* Other admin panel content */}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
