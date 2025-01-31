const FormatPrice = ({ price }) => {
  if (!price) {
    return <>...Loading</>;
  }
  return Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(price);
};

export default FormatPrice;
