import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import ShoppingOrderDetailsView from "./ShoppingOrderDetailsView";
import FormatPrice from "@/helpers/FormatPrice";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";

const ShoppingOrders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);
  const dispatch = useDispatch();

  const handleFetchOrderDetails = (getId) => {
    console.log(getId);
    dispatch(getOrderDetails(getId));
  };

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  console.log(orderDetails, "orderDetails");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Order History</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0 ? (
                orderList.map((orderItem, index) => (
                  <TableRow key={index}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus.toLowerCase() === "confirmed"
                            ? "bg-green-500"
                            : orderItem?.orderStatus.toLowerCase() ===
                              "rejected"
                            ? "bg-red-600"
                            : "bg-black"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <FormatPrice priceTwoDigit={orderItem?.totalAmount} />
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 font-bold text-lg"
                  >
                    No Orders Found!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {orderList && orderList.length > 0 ? (
            orderList.map((orderItem, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Order ID:</p>
                      <p className="text-xs text-gray-500 break-all">
                        {orderItem?._id}
                      </p>
                    </div>
                    <Badge
                      className={`py-1 px-3 ${
                        orderItem?.orderStatus.toLowerCase() === "confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus.toLowerCase() === "rejected"
                          ? "bg-red-600"
                          : "bg-black"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Date:</p>
                      <p className="text-xs text-gray-500">
                        {orderItem?.orderDate.split("T")[0]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Amount:</p>
                      <p className="text-xs text-gray-500">
                        <FormatPrice priceTwoDigit={orderItem?.totalAmount} />
                      </p>
                    </div>
                  </div>

                  <Dialog
                    open={openDetailsDialog}
                    onOpenChange={() => {
                      setOpenDetailsDialog(false);
                      dispatch(resetOrderDetails());
                    }}
                  >
                    <Button
                      onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      className="w-full mt-2"
                    >
                      View Details
                    </Button>
                    <ShoppingOrderDetailsView orderDetails={orderDetails} />
                  </Dialog>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-4 font-bold text-lg">
              No Orders Found!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShoppingOrders;
