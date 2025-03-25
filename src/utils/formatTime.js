export const formatTime = (epochTime) => {
  const date = new Date(epochTime * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};
