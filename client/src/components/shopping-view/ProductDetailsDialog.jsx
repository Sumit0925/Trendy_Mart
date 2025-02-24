import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetails } from "@/store/shop/products-slice";
import StarRating from "../common/StarRating";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import { addReview, clearError, getReviews } from "@/store/shop/review-slice";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import ShowStarRating from "../common/ShowStarRating";

const ProductDetailsDialog = ({
  open,
  setOpen,
  productDetails,
  handleAddToCart,
}) => {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { reviews, error } = useSelector((state) => state.shopReview);

  const { toast } = useToast();
  const location = useLocation();

  const handleRatingChange = (getRating) => {
    setRating(getRating);
  };

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  };

  const handleAddReview = async () => {
    dispatch(clearError()); // Clear previous error before submitting

    if (!productDetails?._id || !user?.id) {
      return toast({
        title: "Unable to add review",
        description: "Product or user information is missing.",
        variant: "destructive",
      });
    }

    try {
      const result = await dispatch(
        addReview({
          productId: productDetails?._id,
          userId: user?.id,
          userName: user?.userName,
          reviewMessage: reviewMsg,
          reviewValue: rating,
        })
      );

      if (result?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id)); // Refresh reviews
        toast({
          className: cn("border-green-500 bg-green-500 text-neutral-50"),
          title: "Review added successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: result?.payload?.message || "Failed to add review.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearError());
  }, [location.pathname]); // Clear error when route changes

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 p-4 sm:p-6 md:p-8 lg:p-12 max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[70vw] h-[90vh] sm:h-[80vh] md:h-auto overflow-auto" style={{scrollbarWidth:"none"}}>
        <div className="w-fit h-[9.2rem] sm:h-fit sm:w-full overflow-hidden rounded-lg sm:max-h-[40vh] md:max-h-none m-auto">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="hidden sm:block aspect-square w-full object-cover"
          />
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={260}
            height={300}
            className="sm:hidden"
          />
        </div>
        <div className="flex flex-col">
          <div>
            <DialogTitle>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold">{productDetails?.title}</p>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base sm:text-lg md:text-xl mb-3 md:mb-5 mt-2 md:mt-4">
              {productDetails?.description}
            </DialogDescription>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-xl md:text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-lg md:text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex flex-row items-center gap-1">
              <ShowStarRating rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          <div className="mt-3 md:mt-5 mb-3 md:mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />

          <div
            className="mt-3 max-h-[41vh] md:max-h-[300px] overflow-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            <div className="mt-2 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex flex-row gap-1">
                <StarRating
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
                className="mb-4"
              >
                Submit
              </Button>
            </div>
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-4">Reviews</h2>
            <div className="grid gap-4 md:gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, index) => (
                  <div key={index} className="flex gap-2 md:gap-4">
                    <Avatar className="w-8 h-8 md:w-10 md:h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm md:text-base font-bold capitalize">
                          {reviewItem?.userName}
                        </h3>
                        <span className="flex flex-row items-center gap-1">
                          <ShowStarRating rating={reviewItem?.reviewValue} />
                        </span>
                      </div>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1 className="text-center text-muted-foreground">No Reviews</h1>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;