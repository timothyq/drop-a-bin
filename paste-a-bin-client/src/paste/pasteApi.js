import { makeHttpRequest } from "../common/util";

export async function getPasteData(pasteId, pastePassword) {
  return await makeHttpRequest(`/api/paste/${pasteId}`, "GET", null, {
    sharePassword: pastePassword,
  });
}

export async function createPaste(paste) {
  return await makeHttpRequest("/api/paste", "POST", JSON.stringify(paste));
}

export async function updatePaste(paste) {
  return await makeHttpRequest("/api/paste", "PUT", JSON.stringify(paste));
}

export async function deletePaste(pasteId) {
  return await makeHttpRequest(`/api/paste/${pasteId}`, "DELETE");
}
