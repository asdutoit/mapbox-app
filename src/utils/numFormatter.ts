function numFormatter(num: number) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B"; // convert to B for number >= 1 billion
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // convert to M for number >= 1 million
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"; // convert to K for number >= 1000
  } else {
    return num.toString(); // if value < 1000, return as is
  }
}

export { numFormatter };
