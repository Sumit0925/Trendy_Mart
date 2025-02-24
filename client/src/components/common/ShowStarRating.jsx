import { StarIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const ShowStarRating = ({ rating }) => {
  return [1, 2, 3, 4, 5].map((star) => (
    <div
      className={`border-none transition-colors ${
        star <= rating
          ? "text-yellow-500 hover:bg-black"
          : "text-black hover:bg-primary hover:text-primary-foreground"
      }`}
      variant="outline"
      size="icon"
    >
      <StarIcon
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          star <= rating ? "fill-yellow-500" : "fill-black"
        }`}
      />
    </div>
  ));
};

export default ShowStarRating;
