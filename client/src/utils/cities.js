// Mirrors server/demo/cities.js. Used by the location picker when no Mapbox token is configured.
// Coordinates are [longitude, latitude].
export const CITIES = [
  { name: "Pune, Maharashtra", center: [73.8567, 18.5204] },
  { name: "Mumbai, Maharashtra", center: [72.8777, 19.076] },
  { name: "Lonavala, Maharashtra", center: [73.4062, 18.7546] },
  { name: "Nashik, Maharashtra", center: [73.7898, 19.9975] },
  { name: "Bangalore, Karnataka", center: [77.5946, 12.9716] },
  { name: "Mysore, Karnataka", center: [76.6394, 12.2958] },
  { name: "Coorg, Karnataka", center: [75.7382, 12.4244] },
  { name: "Chennai, Tamil Nadu", center: [80.2707, 13.0827] },
  { name: "Pondicherry, Tamil Nadu", center: [79.8083, 11.9416] },
  { name: "Vellore, Tamil Nadu", center: [79.1325, 12.9165] },
  { name: "Delhi, Delhi", center: [77.1025, 28.7041] },
  { name: "Jaipur, Rajasthan", center: [75.7873, 26.9124] },
  { name: "Agra, Uttar Pradesh", center: [78.0081, 27.1767] },
  { name: "Chandigarh, Punjab", center: [76.7794, 30.7333] },
  { name: "Hyderabad, Telangana", center: [78.4867, 17.385] },
  { name: "Warangal, Telangana", center: [79.5941, 17.9689] },
  { name: "Vijayawada, Andhra Pradesh", center: [80.648, 16.5062] },
  { name: "Goa, Goa", center: [73.8278, 15.4909] },
  { name: "Ahmedabad, Gujarat", center: [72.5714, 23.0225] },
  { name: "Kolkata, West Bengal", center: [88.3639, 22.5726] },
];

export const cityByName = (name) => CITIES.find((c) => c.name === name);

// Turn "pune, maharashtra" (as stored by the API) into "Pune"
export const shortCity = (name) => {
  if (!name) return "";
  const first = name.split(",")[0].trim();
  return first.charAt(0).toUpperCase() + first.slice(1);
};
