const FormatPrice = ({ price, priceTwoDigit }) => {
  if (!price && !priceTwoDigit) {
    return <>...Loading</>;
  }
  // console.log(price.toFixed(2));
  if (price) {
    return Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  } else {
    return Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(priceTwoDigit);
  }
};

export default FormatPrice;
