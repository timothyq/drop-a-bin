import { makeHttpRequest } from "../common/util";

export async function getHubData() {
  return await makeHttpRequest("/api/hub");
}
