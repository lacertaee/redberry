const department_api = "https://momentum.redberryinternship.ge/api/departments";
const token = "9e71cf24-bbcd-4a20-9005-6e26629aa825";
const options = Array.from(document.querySelectorAll(".dropdown-list"));

document.addEventListener("DOMContentLoaded", () => {
  $("#myModal").on("shown.bs.modal", function () {
    $("#myInput").trigger("focus");
  });
  axios
    .get("https://momentum.redberryinternship.ge/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => console.error(error));
});
