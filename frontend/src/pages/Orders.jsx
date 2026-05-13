import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../services/api";
import { toast } from "react-toastify";
import {
  BoxSeam,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Search,
  ClockHistory,
} from "react-bootstrap-icons";

const Orders = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedOrderHistory, setSelectedOrderHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view orders");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await orderAPI.getCancelledOrders();
      setSelectedOrderHistory(response.data);
      setShowHistory(true);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load order history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="text-warning me-2" />;
      case "processing":
        return <BoxSeam className="text-info me-2" />;
      case "shipped":
        return <Truck className="text-primary me-2" />;
      case "delivered":
        return <CheckCircle className="text-success me-2" />;
      case "cancelled":
        return <XCircle className="text-danger me-2" />;
      default:
        return <BoxSeam className="text-secondary me-2" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const activeOrders = orders.filter((order) => order.status !== "cancelled");

  const filteredOrders =
    filter === "all"
      ? activeOrders
      : activeOrders.filter((order) => order.status === filter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="spinner-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="fw-bold">My Orders</h1>
            <p className="text-muted">Track and manage your orders</p>
          </div>
          <button className="btn btn-info" onClick={handleViewHistory}>
            <ClockHistory className="me-2" />
            History
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("all")}
            >
              All Orders ({activeOrders.length})
            </button>
            <button
              type="button"
              className={`btn ${filter === "pending" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              type="button"
              className={`btn ${filter === "processing" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("processing")}
            >
              Processing
            </button>
            <button
              type="button"
              className={`btn ${filter === "shipped" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("shipped")}
            >
              Shipped
            </button>
            <button
              type="button"
              className={`btn ${filter === "delivered" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("delivered")}
            >
              Delivered
            </button>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-5">
          <BoxSeam size={80} className="text-muted mb-4" />
          <h4>No orders found</h4>
          <p className="text-muted mb-4">
            {filter === "all"
              ? "You haven't placed any orders yet."
              : `No ${filter} orders found.`}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            {filteredOrders.map((order) => (
              <div key={order.orderId} className="card mb-4">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <div className="d-flex align-items-center">
                        {getStatusIcon(order.status)}
                        <div>
                          <h6 className="mb-0">Order #{order.orderId}</h6>
                          <small className="text-muted">
                            {formatDate(order.date)}
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="mb-2">
                        <span className="badge bg-light text-dark">
                          {order.products.length} item
                          {order.products.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <span
                        className={`badge bg-${getStatusColor(order.status)}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>

                    <div className="col-md-3">
                      <h6 className="mb-0">${order.total.toFixed(2)}</h6>
                      <small className="text-muted">Total amount</small>
                    </div>

                    <div className="col-md-3 text-end">
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => navigate(`/order/${order.orderId}`)}
                      >
                        View Details
                      </button>
                      {order.status === "delivered" && (
                        <button className="btn btn-outline-success btn-sm">
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mt-3 pt-3 border-top">
                    <div className="row">
                      {order.products.slice(0, 3).map((item, index) => (
                        <div key={index} className="col-md-4 mb-2">
                          <div className="d-flex align-items-center">
                            <img
                              src={
                                item.productInfo.images?.[0] ||
                                "https://via.placeholder.com/50"
                              }
                              alt={item.productInfo.name}
                              className="rounded me-2"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <small className="d-block">
                                {item.productInfo.name}
                              </small>
                              <small className="text-muted">
                                Qty: {item.quantity} × ${item.productInfo.price}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                      {order.products.length > 3 && (
                        <div className="col-md-4">
                          <div className="d-flex align-items-center h-100">
                            <small className="text-muted">
                              +{order.products.length - 3} more items
                            </small>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {showHistory && selectedOrderHistory && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "#8d6e63", color: "white" }}
              >
                <h5 className="modal-title">
                  Cancelled Orders History (
                  {selectedOrderHistory.totalCancelled || 0})
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowHistory(false)}
                ></button>
              </div>
              <div className="modal-body">
                {historyLoading ? (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : selectedOrderHistory.cancelledOrders &&
                  selectedOrderHistory.cancelledOrders.length > 0 ? (
                  <div>
                    <p className="text-muted mb-4">
                      Total cancelled orders:{" "}
                      {selectedOrderHistory.totalCancelled}
                    </p>
                    {selectedOrderHistory.cancelledOrders.map(
                      (cancelled, index) => (
                        <div key={index} className="card mb-3 border-danger">
                          <div className="card-body">
                            <div className="row mb-3">
                              <div className="col-md-6">
                                <p className="mb-1">
                                  <strong>Order ID:</strong> {cancelled.orderId}
                                </p>
                                <small className="text-muted">
                                  Original order date:{" "}
                                  {formatDate(cancelled.orderDate)}
                                </small>
                              </div>
                              <div className="col-md-6">
                                <p className="mb-1">
                                  <strong>Cancelled on:</strong>{" "}
                                  {formatDateTime(cancelled.changedAt)}
                                </p>
                              </div>
                            </div>
                            {cancelled.reason && (
                              <p className="mb-3 p-2 bg-light rounded">
                                <strong>Reason:</strong> {cancelled.reason}
                              </p>
                            )}
                            <hr />
                            <h6 className="fw-bold mb-3">Products in Order:</h6>
                            {cancelled.products &&
                              cancelled.products.map((product, pidx) => (
                                <div
                                  key={pidx}
                                  className="d-flex justify-content-between mb-2 pb-2 border-bottom"
                                >
                                  <div>
                                    <p className="mb-0">
                                      {product.productInfo?.name}
                                    </p>
                                    <small className="text-muted">
                                      Qty: {product.quantity}
                                    </small>
                                  </div>
                                  <span className="fw-bold">
                                    $
                                    {(
                                      product.productInfo?.price *
                                      product.quantity
                                    )?.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            <div className="d-flex justify-content-between fw-bold mt-3 pt-3 border-top">
                              <span>Order Total:</span>
                              <span>${cancelled.total?.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted">No cancelled orders in history</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowHistory(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Stats */}
      <div className="row mt-5">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-primary">{orders.length}</h3>
              <p className="text-muted mb-0">Total Orders</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-success">
                {orders.filter((o) => o.status === "delivered").length}
              </h3>
              <p className="text-muted mb-0">Delivered</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-warning">
                {
                  orders.filter(
                    (o) => o.status === "pending" || o.status === "processing",
                  ).length
                }
              </h3>
              <p className="text-muted mb-0">In Progress</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-danger">
                {orders.filter((o) => o.status === "cancelled").length}
              </h3>
              <p className="text-muted mb-0">Cancelled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
