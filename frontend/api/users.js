import apiOrigin from "./api";

// Get a user
export const getUser = (id) => {
  return fetch(`${apiOrigin}/users/${id}`).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
};

// Create a user
export const createUser = (user) => {
  return fetch(`${apiOrigin}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
};

// Update a user
export const updateUser = (id, user) => {
  return fetch(`${apiOrigin}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
};

// Delete a user
export const deleteUser = (id) => {
  return fetch(`${apiOrigin}/users/${id}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
};

export const getWeightIndicators = (id) => {
  return fetch(`${apiOrigin}/users/${id}/weight-indicators`).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
};

export const getPlan = (id) => {
  return fetch(`${apiOrigin}/users/${id}/plan`).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
};

export const getDiary = (id) => {
  return fetch(`${apiOrigin}/users/${id}/diary`).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
};

export const updateDiary = async (userId, updatedDiary) => {
  const response = await fetch(`${apiOrigin}/users/${userId}/diary`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedDiary),
  });
  const data = await response.json();
  return data;
};
