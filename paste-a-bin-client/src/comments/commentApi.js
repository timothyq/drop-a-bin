import { makeHttpRequest } from "../common/util";

export async function createComment(comment) {
  return await makeHttpRequest("/api/comment", "POST", JSON.stringify(comment));
}

export async function updateComment(comment) {
  return await makeHttpRequest("/api/comment", "PUT", JSON.stringify(comment));
}

export async function deleteComment(commentId) {
  return await makeHttpRequest(`/api/comment/${commentId}`, "DELETE");
}

export async function getCommentsForPaste(pasteId) {
  return await makeHttpRequest(`/api/comment/byPasteId/${pasteId}`);
}
