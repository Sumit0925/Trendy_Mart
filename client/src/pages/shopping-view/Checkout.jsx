import Address from "@/components/shopping-view/Address";
// import img from "../../assets/35832.jpg"
// import img from "../../assets/shopping-cart-black-background-with-copy-space.jpg";
import img from "../../assets/shopping-cart.jpg";
import UserCartItemsContent from "@/components/shopping-view/UserCartItemsContent";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormatPrice from "@/helpers/FormatPrice";
import { useNavigate } from "react-router-dom";
import { capturePayment, createNewOrder } from "@/store/shop/order-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";

const Checkout = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  // console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  //* Load RazorPay function

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });
  };

  //* Handle and Initiating Paypal Payment

  const handleInitiateRazorpayPayment = async () => {
    if (cartItems.length === 0) {
      toast({ title: "Your cart is empty.", variant: "destructive" });
      return;
    }
    if (!currentSelectedAddress) {
      toast({ title: "Please select an address.", variant: "destructive" });
      return;
    }

    setIsPaymentStart(true);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "Razorpay",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    try {
      // Step 1: Create an order in backend
      const data = await dispatch(createNewOrder(orderData));

      if (!data?.payload?.success) {
        toast({ title: "Order creation failed.", variant: "destructive" });
        setIsPaymentStart(false);
        return;
      }

      const { razorpayOrder } = data.payload;

      // Step 2: Load Razorpay dynamically
      const Razorpay = await loadRazorpay();

      // Step 3: Configure Razorpay payment options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Your Company",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            const verifyRes = await dispatch(
              capturePayment({
                orderId: razorpayOrder.id,
                paymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              })
            );

            if (verifyRes?.payload?.success) {
              toast({ title: "Payment Successful!", variant: "success" });
              dispatch(fetchCartItems(user?.id));
              navigate("/shop/payment-success"); // Redirect to success page
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            toast({
              title: "Payment verification failed!",
              variant: "destructive",
            });
            navigate("/shop/payment-failed"); // Redirect to failure page
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
          contact: currentSelectedAddress?.phone,
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: () => {
            toast({ title: "Payment Cancelled!", variant: "destructive" });
            navigate("/shop/payment-failed"); // Redirect if user closes Razorpay modal
          },
        },
      };

      // Step 4: Open Razorpay checkout
      const paymentInstance = new Razorpay(options);
      paymentInstance.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      toast({
        title: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }

    setIsPaymentStart(false);
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[380px] w-full overflow-hidden">
        <img
          src={img}
          className="h-full w-full object-cover object-left sm:object-cover sm:object-bottom"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.title} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">
                <FormatPrice priceTwoDigit={totalCartAmount} />
              </span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiateRazorpayPayment} className="w-full">
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with RazorPay"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
