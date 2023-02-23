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