const calculatePriceAfterDiscount = (price, discount) => {
  if (discount) {
    const discountAmount = price * (discount / 100);
    return price - discountAmount;
  }
  return price;
};

export { calculatePriceAfterDiscount };
