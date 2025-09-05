export const statusMap: Record<string, string | undefined> = {
  All: undefined,
  Pending: "pending",
  Preparing: "preparing",
  "Ready to Pickup": "ready_for_pickup",
  Completed: "released",
  Canceled: "rejected",
};

export const cancelOptions = [
  "Changed my mind",
  "Found a better price",
  "Ordered by mistake",
  "Other",
];
