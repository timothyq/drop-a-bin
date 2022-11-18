export async function makeHttpRequest(url, method, body, additionalHeaders) {
  const baseUrl =
    process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";
  url = baseUrl + url;
  try {
    let res;
    if (!method) {
      method = "GET";
    }
    let headers = {};
    if (additionalHeaders) {
      headers = { ...headers, ...additionalHeaders };
    }
    if (!body) {
      headers = {
        ...{
          Accept: "application/json",
          user: window.localStorage.getItem("username"),
        },
        ...headers,
      };
      res = await fetch(url, {
        method,
        headers,
      });
    } else {
      headers = {
        ...{
          Accept: "application/json",
          "Content-Type": "application/json",
          user: window.localStorage.getItem("username"),
        },
        ...headers,
      };
      res = await fetch(url, {
        method,
        headers,
        body,
      });
    }
    if (res.ok && res.status === 200) {
      const body = await res.json();
      if (body.success !== true && !body.data) {
        body.data = { error: "error" };
      }
      return body.data;
    }
  } catch (e) {
    console.error("Operation Failed");
  }
}
