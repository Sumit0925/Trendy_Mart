import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");
  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (paymentId && payerId) {
  //       const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

  //       dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
  //         if (data?.payload?.success) {
  //           sessionStorage.removeItem("currentOrderId");
  //           window.location.href = "/shop/payment-success";
  //         }
  //       });
  //     }
  //   }, [paymentId, payerId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Failed ❌</CardTitle>
        <CardDescription>
          Something went wrong. Please try again.
        </CardDescription>
      </CardHeader>
      <Button className="mt-5" onClick={() => navigate("/shop/checkout")}>
        Checkout
      </Button>
    </Card>
  );
};

export default PaymentFailed;
