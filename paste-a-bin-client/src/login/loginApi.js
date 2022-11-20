import { makeHttpRequest } from "../common/util";

export async function login(username, password) {
  return await makeHttpRequest(
    "/api/login",
    "POST",
    JSON.stringify({ username, password })
  );
}
