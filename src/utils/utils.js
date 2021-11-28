export const parseJwt = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const get = async (url, token = "") => {
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await resp.json();
  return data;
};

export const post = async (url, body = {}, token = "") => {
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if(resp.status === 429) {
    throw new Error("Too many requests");
  }
  const data = await resp.json();
  return data;
};

export const getUsers = async () => {
  const data = await get(`${process.env.API_URL}/api/users`);
  return data.payload;
};

export const makeAdmin = async (id) => {
  const data = await get(
    `${process.env.API_URL}/api/makeAdmin/${id}`,
    window.localStorage.getItem("token")
  );
  return data;
};

export const removeAdmin = async (id) => {
  const data = await get(
    `${process.env.API_URL}/api/removeAdmin/${id}`,
    window.localStorage.getItem("token")
  );
  return data;
};

export const submitTask = async (body) => {
  const data = await post(
    `${process.env.API_URL}/api/task/submit`,
    body,
    window.localStorage.getItem("token")
  );
  return data;
};

export const getTasks = async () => {
  const data = await get(
    `${process.env.API_URL}/api/tasks`,
    window.localStorage.getItem("token")
  );
  return data;
};

export const getTask = async (day) => {
  const data = await get(
    `${process.env.API_URL}/api/task/${day}`,
    window.localStorage.getItem("token")
  );
  return data;
}

export const makeSubmission = async (body) => {
  const data = await post(
    `${process.env.API_URL}/api/submission`,
    body,
    window.localStorage.getItem("token")
  );
  return data;
};
