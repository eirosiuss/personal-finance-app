const formData = (dataString) => {
  const date = new Date(dataString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleString("en-UK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour:"2-digit",
    minute:"2-digit",
    hour12: "true"
  });
};

export default formData;
