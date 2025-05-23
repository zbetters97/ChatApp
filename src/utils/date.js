import dayjs from "dayjs";

/* Monday, January 1 */
export function formatDateDMD(date) {
  return dayjs(date).format("dddd, MMMM D");
}

/* 12:00 AM */
export function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/* 1h ago */
export function getTimeSinceShort(date) {
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return minutes + "m ago";
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return hours + "h ago";
  }

  const days = Math.round(hours / 24);
  if (days < 7) {
    return days + "d ago";
  }

  const weeks = Math.round(days / 7);
  if (weeks < 4) {
    return weeks + "w ago";
  }

  const months = Math.round(days / 30.44);
  if (months < 12) {
    return months + "mo ago";
  }

  const years = Math.round(months / 12);
  return years + "y ago";
}
