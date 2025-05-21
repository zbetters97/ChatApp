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
