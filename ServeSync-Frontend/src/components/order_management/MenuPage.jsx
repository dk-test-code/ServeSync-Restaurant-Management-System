import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import EmployeeNavbar from "../EmployeeNavBar";
import EmployeeSideBar from "../EmployeeSideBar";
import BillGenerationModal from "./BillGenerationModal";
const token = localStorage.getItem("token");

const MenuPage = () => {
  const location = useLocation();
  const selectedTableInfo = location.state.selectedTableInfo;
  const orderType = location.state.orderType;
  const [foodItems, setFoodItems] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    // Retrieve cart items from local storage or initialize to an empty object
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : {};
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showBillModal, setShowBillModal] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);
  const [sgstAmount, setSgstAmount] = useState(0);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [orderId, setOrderId] = useState(0);
  const [sumTotalPrices, setSumTotalPrices] = useState(0);

  const navigate = useNavigate();

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/food-items",
          config
        );
        setFoodItems(response.data);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
      setIsLoading(false);
    };

    fetchFoodItems();
  }, [config]);

  useEffect(() => {
    // Update local storage when cart items change
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const getCartKey = () => {
    return selectedTableInfo
      ? `cartItems_${selectedTableInfo.id}`
      : "cartItems_takeaway";
  };

  const addToCart = (foodItemId) => {
    const selectedItem = foodItems.find((item) => item.id === foodItemId);
    const cartKey = getCartKey();
    const currentCart = cartItems[cartKey] || [];

    const itemInCart = currentCart.find((item) => item.id === foodItemId);
    if (itemInCart) {
      setCartItems({
        ...cartItems,
        [cartKey]: currentCart.map((item) =>
          item.id === foodItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      setCartItems({
        ...cartItems,
        [cartKey]: [...currentCart, { ...selectedItem, quantity: 1 }],
      });
    }
    if (!selectedItem.available) {
      const updatedCartItems = currentCart.filter(
        (item) => item.id !== foodItemId
      );
      setCartItems({ ...cartItems, [cartKey]: updatedCartItems });
      return;
    }
  };

  const removeFromCart = (foodItemId) => {
    const cartKey = getCartKey();
    const currentCart = cartItems[cartKey] || [];
    setCartItems({
      ...cartItems,
      [cartKey]: currentCart.filter((item) => item.id !== foodItemId),
    });
  };

  const increaseQuantity = (foodItemId) => {
    const cartKey = getCartKey();
    const currentCart = cartItems[cartKey] || [];
    setCartItems({
      ...cartItems,
      [cartKey]: currentCart.map((item) =>
        item.id === foodItemId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    });
  };

  const decreaseQuantity = (foodItemId) => {
    const cartKey = getCartKey();
    const currentCart = cartItems[cartKey] || [];
    setCartItems({
      ...cartItems,
      [cartKey]: currentCart.map((item) =>
        item.id === foodItemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    });
  };

  const filteredFoodItems = foodItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Place Order handler
  const handlePlaceOrder = async () => {
    const cartKey = getCartKey();
    const currentCart = cartItems[cartKey] || [];
    if (orderType === "TAKEAWAY") {
      console.log("Am in Takeaway");
      const orderItems = currentCart.map((item) => ({
        foodItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
        deliveryStatus: "DELIVERED",
        createdAt: new Date().toISOString(),
      }));

      const orderData = {
        orderType,
        status: "PENDING",
        sgstPercent: "2.5",
        cgstPercent: "2.5",
        orderItems,
      };

      const orderResponse = await axios.post(
        "http://localhost:8080/orders",
        orderData,
        config
      );

      const sumTotalPrices = orderItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      setSumTotalPrices(sumTotalPrices);

      const cgstAmount =
        (sumTotalPrices * orderResponse.data.cgstPercent) / 100;
      setCgstAmount(cgstAmount);

      const sgstAmount =
        (sumTotalPrices * orderResponse.data.sgstPercent) / 100;
      setSgstAmount(sgstAmount);

      const grandTotal = sumTotalPrices + sgstAmount + cgstAmount;
      setGrandTotal(grandTotal);

      console.log("Order created:", orderResponse.data);
      console.log("order id is:", orderResponse.data.orderId);
      setOrderId(orderResponse.data.orderId);
      setShowBillModal(true);
    } else {
      try {
        await axios.put(
          `http://localhost:8080/dining-tables/${selectedTableInfo.id}`,
          { ...selectedTableInfo, currentStatus: "OCCUPIED" },
          config
        );
      } catch (error) {
        console.error("Error updating table status:", error);
      }

      try {
        let orderResponse;

        if (selectedTableInfo.currentStatus === "OCCUPIED") {
          orderResponse = await axios.get(
            `http://localhost:8080/orders/findOrderId?tableId=${selectedTableInfo.id}&paymentStatus=PENDING`,
            config
          );

          if (orderResponse.data) {
            const orderId = orderResponse.data;
            console.log("The orderId is", orderId);
            const orderItems = currentCart.map((item) => ({
              orderId: orderId,
              foodItemId: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              tableId: selectedTableInfo.id,
              tableName: selectedTableInfo.name,
              totalPrice: item.price * item.quantity,
              deliveryStatus: "PENDING",
              createdAt: new Date().toISOString(),
            }));

            for (const orderItem of orderItems) {
              const response = await axios.post(
                "http://localhost:8080/order-items",
                orderItem,
                config
              );
              console.log("Order item created:", response.data);
            }
          } else {
            console.log("No pending payment found for the table.");
            return;
          }
        } else {
          const orderItems = currentCart.map((item) => ({
            foodItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            tableId: selectedTableInfo.id,
            tableName: selectedTableInfo.name,
            totalPrice: item.price * item.quantity,
            deliveryStatus: "PENDING",
            createdAt: new Date().toISOString(),
          }));

          const orderData = {
            orderType,
            status: "PENDING",
            diningTable: selectedTableInfo,
            sgstPercent: "2.5",
            cgstPercent: "2.5",
            orderItems,
          };

          orderResponse = await axios.post(
            "http://localhost:8080/orders",
            orderData,
            config
          );
        }

        console.log("Order created:", orderResponse.data);
        toast.success(
          `Order Placed successfully for the table ${selectedTableInfo.name} - ${selectedTableInfo.floorNumber}`
        );
        navigate("/employee/take-order");
      } catch (error) {
        console.error("Error placing order:", error);
      }
    }
    const updatedCartItems = { ...cartItems };
    delete updatedCartItems[cartKey];
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  // Render loading indicator while fetching data
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <EmployeeNavbar />

      <div
        className="container-fluid"
        style={{
          height: "100vh",
          display: "flex",
          padding: "0",
        }}
      >
        <EmployeeSideBar />

        <main
          className="flex-grow-1 px-4"
          style={{
            paddingRight: "0 !important",
            paddingLeft: "1.5rem !important",
            marginRight: "0 !important",
            marginLeft: "1.5rem !important",
          }}
        >
          <div className="row">
            <div className="col-md-9">
              <h1 className="text-center">Menu</h1>
              {orderType === "DINE_IN" && selectedTableInfo ? (
                <h1 className="text-center">
                  Table No. {selectedTableInfo.name}
                </h1>
              ) : (
                <h1 className="text-center">Take-Away Order</h1>
              )}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by category or food item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Group food items into rows */}
              {filteredFoodItems
                .reduce((rows, foodItem, index) => {
                  if (index % 4 === 0) {
                    rows.push([]);
                  }
                  rows[rows.length - 1].push(foodItem);
                  return rows;
                }, [])
                .map((row, rowIndex) => (
                  <div key={rowIndex} className="row">
                    {row.map((foodItem) => (
                      <div key={foodItem.id} className="col-md-3 mb-4">
                        <div className="card h-80" style={{ height: 380 }}>
                          <img
                            src={`data:image/jpeg;base64,${foodItem.imageData}`} // Assuming imageData is base64 encoded
                            className="card-img-top"
                            alt={foodItem.name}
                            height="175"
                          />
                          <div className="card-body d-flex flex-column ">
                            <h5 className="card-title">{foodItem.name}</h5>
                            <p className="card-text">
                              Category: {foodItem.categoryName}
                            </p>
                            <p className="card-text">
                              Price: Rs.{foodItem.price}
                            </p>
                            {foodItem.available ? (
                              <button
                                className="btn btn-primary mt-auto"
                                onClick={() => addToCart(foodItem.id)}
                              >
                                Add to Cart
                              </button>
                            ) : (
                              <p className="text-danger">Out of Stock</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order Cart</h5>
                  {cartItems[getCartKey()] &&
                    cartItems[getCartKey()].map((item) => (
                      <div key={item.id} className="mb-3">
                        <p>{item.name}</p>
                        <div className="d-flex align-items-center ">
                          <p className="mr-3">Quantity: {item.quantity}</p>
                          <div>
                            <button
                              className="btn btn-sm btn-primary mr-1 m-2"
                              onClick={() => increaseQuantity(item.id)}
                            >
                              +
                            </button>
                            <button
                              className="btn btn-sm btn-primary mr-1 m-2"
                              onClick={() => decreaseQuantity(item.id)}
                            >
                              -
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <p>Price: Rs. {item.price * item.quantity}</p>
                        <hr />
                      </div>
                    ))}
                  <button
                    className="btn btn-primary btn-block"
                    onClick={handlePlaceOrder}
                    disabled={
                      !cartItems[getCartKey()] ||
                      cartItems[getCartKey()].length === 0
                    }
                  >
                    Place Order
                  </button>
                  {orderType === "TAKEAWAY" && (
                    <BillGenerationModal
                      show={showBillModal}
                      handleClose={() => setShowBillModal(false)}
                      totalAmount={grandTotal}
                      cgstAmount={cgstAmount}
                      sgstAmount={sgstAmount}
                      orderId={orderId} // Pass the orderId directly to the modal
                      sumTotalPrices={sumTotalPrices}
                      config={config}
                      orderType={"TAKEAWAY"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
MenuPage.propTypes = {
  selectedTableInfo: PropTypes.object, // Add prop type validation for tableNumber and order type
  orderType: PropTypes.string,
};
export default MenuPage;
