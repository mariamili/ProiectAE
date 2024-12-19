import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchOrders } from "../routes/orders";
import { setLoggedIn } from "../store/slices/globalSlice";
const Profile = () => {
  const { user } = useSelector((state) => state.global); // Assuming user data is in global state
  console.log("User Data:", user);
  const { loggedIn } = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    
    dispatch(setLoggedIn(false));
    localStorage.removeItem("token");
    navigate("/login");
  };

  

  const { token } = useSelector((state) => state.global); // Get token from Redux
  const [orders, setOrders] = useState([]);

  console.log(token);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetchOrders(token);
        if (response.success) {
          setOrders(response.data);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    getOrders();
  }, [token]);


  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      fontSize: "32px",
      marginBottom: "20px",
      color: "#333",
      textAlign: "center",
    },
    card: {
      backgroundColor: "#fff",
      padding: "15px",
      borderRadius: "10px",
      marginBottom: "20px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      lineHeight: "1.8",
    },
    orderContainer: {
      backgroundColor: "#fff",
      padding: "15px",
      borderRadius: "10px",
      marginBottom: "20px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    button: {
      display: "block",
      width: "100%",
      padding: "10px 15px",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      textAlign: "center",
      marginTop: "20px",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#45a049",
    },
    orderList: {
      listStyleType: "none",
      paddingLeft: "0",
      lineHeight: "1.6",
    },
    orderItem: {
      padding: "5px 0",
    },
  };
  


  return (
    <div style={styles.container}>
  <h1 style={styles.heading}>Profil</h1>
  <div style={styles.card}>
    <p>
      <strong>Nume:</strong> {localStorage.getItem("name")}
    </p>
    <p>
      <strong>Email:</strong> {localStorage.getItem("email")}
    </p>
    <p>
    <strong>Inscris ls:</strong> {new Date(localStorage.getItem("dateJoined")).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  </div>

  <h2>Comenzile tale</h2>
  <div>
    {orders.length > 0 ? (
      orders.map((order) => (
        <div key={order.id} style={styles.orderContainer}>
          <h3>Comanda #{order.id}</h3>
          <p>
            <strong>Adresa:</strong> {order.address}, {order.city}
          </p>
          <p>
            <strong>Total:</strong> ${order.total.toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <h4>Produse:</h4>
          <ul style={styles.orderList}>
            {order.orderRows.map((row, index) => (
              <li key={index} style={styles.orderItem}>
                {row.productName} - Quantity: {row.quantity} - Price: $
                {row.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))
    ) : (
      <p>No orders found.</p>
    )}
  </div>

  <button
    style={styles.button}
    onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
    onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
    onClick={handleLogout}
  >
    Logout
  </button>
</div>

  );
};

// Inline styles for simplicity
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    width: "300px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Profile;
