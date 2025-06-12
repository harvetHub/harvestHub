export function formatPrice(price: number) {
    return (
      "₱" +
      new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(price)
    );
  }