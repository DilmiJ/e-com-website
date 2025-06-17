import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const OrderStatusNotification = ({ orders, previousOrders }) => {
  useEffect(() => {
    if (!previousOrders || !orders) return;

    // Check for status changes
    orders.forEach(currentOrder => {
      const previousOrder = previousOrders.find(prev => prev._id === currentOrder._id);
      
      if (previousOrder && previousOrder.status !== currentOrder.status) {
        // Status changed - show notification
        const statusMessages = {
          'confirmed': '✅ Your order has been confirmed!',
          'processing': '📦 Your order is being processed!',
          'shipped': '🚚 Your order has been shipped!',
          'delivered': '🎉 Your order has been delivered!',
          'cancelled': '❌ Your order has been cancelled.'
        };

        const message = statusMessages[currentOrder.status] || `Order status updated to ${currentOrder.status}`;
        
        toast.success(
          <div>
            <strong>Order #{currentOrder._id.slice(-8)}</strong>
            <br />
            {message}
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    });
  }, [orders, previousOrders]);

  return null; // This component doesn't render anything
};

export default OrderStatusNotification;
