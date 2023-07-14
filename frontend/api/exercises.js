import apiOrigin from "./api";

export const getExercises = (id) => {
  return fetch(`${apiOrigin}/users/${id}/exercises`).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
};

export const deleteExercise = (id) => {
  return fetch(`${apiOrigin}/exercises/${id}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
};

export const createExercise = (userId, exerciseData) => {
  return fetch(`${apiOrigin}/users/${userId}/exercises`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(exerciseData),
  })
  .then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  })
  .catch((err) => {
    console.error(err);
  });
};

export const updateExercise = (exerciseId, exerciseData) => {
  return fetch(`${apiOrigin}/exercises/${exerciseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(exerciseData),
  })
  .then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  })
  .catch((err) => {
    console.error(err);
  });
};
