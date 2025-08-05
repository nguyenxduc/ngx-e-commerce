import { em, p } from "framer-motion/client";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],

    shippingAddress: {
      address: {
        type: String,
        required: [true, "Shipping address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
    },

    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
    },

    paymentResult: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },

      update_time: {
        type: String,
      },
      email_address: {
        type: String,
      },
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
  },

  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
