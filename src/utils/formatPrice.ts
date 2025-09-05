export function formatPrice(price: number) {
    return (
      "₱" +
      new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(price)
    );
  }