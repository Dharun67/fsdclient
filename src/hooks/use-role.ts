export function useRole() {
  try {
    const user = JSON.parse(localStorage.getItem("cf_user") || "{}");
    return { user, role: user.role || "retailer" };
  } catch {
    return { user: {}, role: "retailer" };
  }
}
