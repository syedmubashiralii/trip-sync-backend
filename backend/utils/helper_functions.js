export function getTableByType(type) {
  if (type === "user") return "users";
  if (type === "guide") return "tour_guides";
  if (type === "company") return "companies";
  return null;
}