export function getRelativeTime(date: string | Date): string {
    const now = new Date();
    const inputDate = typeof date === "string" ? new Date(date) : date;
    const diff = (now.getTime() - inputDate.getTime()) / 1000; // in seconds
  
    if (isNaN(diff)) return "";
  
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} mo ago`;
    return `${Math.floor(diff / 31536000)} yr ago`;
  }