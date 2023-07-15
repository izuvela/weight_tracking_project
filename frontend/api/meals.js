import apiOrigin from "./api";

export const getMeals = (id) => {
  return fetch(`${apiOrigin}/users/${id}/meals`).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
};

export const deleteMeal = (id) => {
  return fetch(`${apiOrigin}/meals/${id}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
};

export const createMeal = (userId, mealData) => {
  return fetch(`${apiOrigin}/users/${userId}/meals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mealData),
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

export const updateMeal = (mealId, mealData) => {
  return fetch(`${apiOrigin}/meals/${mealId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mealData),
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

