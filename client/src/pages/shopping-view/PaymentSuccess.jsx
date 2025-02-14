import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="sm:text-4xl sm:text-center ">
          Your Order has been Placed Successfully
        </CardTitle>
      </CardHeader>
      <CardFooter className="p-0 flex sm:justify-around justify-between">
        <Button className="mt-5" onClick={() => navigate("/shop/account")}>
          View Orders
        </Button>
        <Button
          className="mt-5 bg-blue-700"
          onClick={() => navigate("/shop/listing")}
        >
          Continue Shopping
          <span className="mt-1">
            <ArrowRight />
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentSuccess;
