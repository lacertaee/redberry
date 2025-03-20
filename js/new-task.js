const department_api = "https://momentum.redberryinternship.ge/api/departments";
const token = "9e75d312-2d9f-4e7c-968f-c4f82f53a111";
const first = document.querySelector(".first-name");
const marks = Array.from(document.querySelectorAll(".validate"));
const text = Array.from(document.querySelectorAll(".validate-text"));
const last = document.querySelector(".last-name");
const inputs = Array.from(document.querySelectorAll(".inp"));
const modal = document.querySelector(".department-select");
const status = document.querySelector(".status");
const department = document.querySelector(".add-employee-department");
const addUsr = document.querySelector(".add-usr");

const responsible = document.querySelector(".employee");

const options = document.querySelector(".options-employee");
const priority = document.querySelector(".priority");

const priorityOptions = document.querySelector(".options-priority");

const addUserButton = document.querySelector(".finish");
addUserButton.disabled = true;

const addEmployeeOptions = Array.from(
  document.querySelectorAll(".employee-option")
);

addEmployeeOptions[0].addEventListener("click", () => {
  addUsr.click();
});

const image = document.getElementById("image-input");
const trash = document.querySelector(".trash");
let img;
let openOptions = false;

const addUser = document.querySelector(".finish");

document.addEventListener("DOMContentLoaded", () => {
  axios
    .get(department_api)
    .then((response) => {
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.text = data[i].name;
        option.id = data[i].id;
        modal.appendChild(option);
        department.appendChild(option);
      }
    })
    .catch((error) => console.log(error));

  axios
    .get("https://momentum.redberryinternship.ge/api/statuses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.text = data[i].name;
        option.id = data[i].id;
        status.appendChild(option);
      }
    })
    .catch((error) => console.error(error));

  axios
    .get("https://momentum.redberryinternship.ge/api/priorities", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        const div = document.createElement("div");
        div.classList.add("option");
        div.style.minWidth = "259px";
        div.classList.add("priority-option");
        div.innerHTML = `
                    <img
                      class="option-image"
                      src="${data[i].icon}"
                      alt=""
                    />
                    <div>${data[i].name}</div>
                `;
        priorityOptions.appendChild(div);
        div.addEventListener("click", () => {
          document.querySelector(".placeholder-img-priority").src =
            data[i].icon;
          document.querySelector(".placeholder-text-priority").innerHTML =
            data[i].name;
          priorityOptions.classList.add("hidden");
        });
      }
    })
    .catch((error) => console.error(error));

  department.addEventListener("change", function () {
    document.querySelector(".placeholder-img-employee").src = "";
    document
      .querySelector(".placeholder-img-employee")
      .classList.remove("option-image");
    document.querySelector(".placeholder-text-employee").innerHTML = "";
    if (
      document
        .querySelector(".check-responsible")
        .classList.contains("responsible")
    ) {
      document
        .querySelector(".check-responsible")
        .classList.remove("responsible");
      document.querySelector(".bx").classList.remove("responsible");
    }

    if (!options.classList.contains("hidden")) {
      options.classList.add("hidden");
    }

    openOptions = true;

    const delOptions = Array.from(
      document.querySelectorAll(".employee-option")
    );
    for (let i = 1; i < delOptions.length; i++) {
      delOptions[i].remove();
    }
    axios
      .get("https://momentum.redberryinternship.ge/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        const wantedEmployees = data.filter(
          (element) => element.department.name === this.value
        );
        if (wantedEmployees.length < 1) {
          document
            .querySelector(".check-responsible")
            .classList.add("responsible");
          document.querySelector(".bx").classList.add("responsible");
          openOptions = false;
        } else {
          for (let i = 0; i < wantedEmployees.length; i++) {
            const div = document.createElement("div");
            div.classList.add("option");
            div.classList.add("employee-option");
            div.innerHTML = `
                    <img
                      class="option-image"
                      src="${wantedEmployees[i].avatar}"
                      alt=""
                    />
                    <div>${wantedEmployees[i].name} ${wantedEmployees[i].surname}</div>
                `;
            options.appendChild(div);
            div.addEventListener("click", () => {
              document.querySelector(".placeholder-img-employee").src =
                wantedEmployees[i].avatar;
              document
                .querySelector(".placeholder-img-employee")
                .classList.add("option-image");
              document.querySelector(
                ".placeholder-text-employee"
              ).innerHTML = `${wantedEmployees[i].name} ${wantedEmployees[i].surname}`;
              options.classList.add("hidden");
            });
          }
        }
      })
      .catch((error) => console.log(error.status));
  });

  priority.addEventListener("click", () => {
    if (priorityOptions.classList.contains("hidden")) {
      priorityOptions.classList.remove("hidden");
    } else {
      priorityOptions.classList.add("hidden");
    }
  });

  responsible.addEventListener("click", () => {
    if (options.classList.contains("hidden")) {
      if (openOptions) {
        options.classList.remove("hidden");
      }
    } else {
      options.classList.add("hidden");
    }
  });

  first.addEventListener("input", () => {
    validate(4, first);
  });

  last.addEventListener("input", () => {
    validate(6, last);
  });

  inputs[0].addEventListener("input", () => {
    validate(0, inputs[0]);
  });

  inputs[1].addEventListener("input", () => {
    validate(2, inputs[1]);
  });

  modal.addEventListener("change", (event) => {
    department = Number(event.target.selectedOptions[0].id);
  });

  addUser.addEventListener("click", () => {
    create(first, last, department, img);
  });

  image.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const show = document.querySelector(".img");
      show.src = e.target.result;
      image.style.display = "none";
      show.style.width = "88px";
      show.style.height = "88px";
      show.style.borderRadius = "50%";
      show.style.objectFit = "cover";
      show.style.objectPosition = "top";
      trash.style.display = "block";
      document.querySelector(".upload-image-text").style.display = "none";
    };
    reader.readAsDataURL(file);
    img = file;
  });
  trash.addEventListener("click", () => {
    const show = document.querySelector(".img");
    show.removeAttribute("style");
    show.src = "../images/Frame 1000005790.png";
    document.querySelector(".upload-image-text").style.display = "block";
    trash.style.display = "none";
    image.style.display = "block";
  });
});

function validate(num, input) {
  if (input.value.length < 2) {
    if (input.classList.contains("correct-input")) {
      input.classList.remove("correct-input");
    }
    input.classList.add("incorrect-input");
    if (marks[num].classList.contains("correct-mark")) {
      marks[num].classList.remove("correct-mark");
    }
    if (text[num].classList.contains("correct-text")) {
      text[num].classList.remove("correct-text");
    }

    marks[num].classList.add("incorrect-mark");
    text[num].classList.add("incorrect-text");
  } else if (input.value.length > 255) {
    if (input.classList.contains("correct-input")) {
      input.classList.remove("correct-input");
    }
    input.classList.add("incorrect-input");
    if (marks[num + 1].classList.contains("correct-mark")) {
      marks[num + 1].classList.remove("correct-mark");
    }
    if (text[num + 1].classList.contains("correct-text")) {
      text[num + 1].classList.remove("correct-text");
    }
    marks[num + 1].classList.add("incorrect-mark");
    text[num + 1].classList.add("incorrect-text");
  } else {
    if (input.classList.contains("incorrect-input")) {
      input.classList.remove("incorrect-input");
    }
    input.classList.add("correct-input");
    if (marks[num].classList.contains("incorrect-mark")) {
      marks[num].classList.remove("incorrect-mark");
    }
    if (marks[num + 1].classList.contains("incorrect-mark")) {
      marks[num + 1].classList.remove("incorrect-mark");
    }
    if (text[num].classList.contains("incorrect-text")) {
      text[num].classList.remove("incorrect-text");
    }
    if (text[num + 1].classList.contains("incorrect-text")) {
      text[num + 1].classList.remove("incorrect-text");
    }
    marks[num].classList.add("correct-mark");
    text[num].classList.add("correct-text");
    marks[num + 1].classList.add("correct-mark");
    text[num + 1].classList.add("correct-text");
  }
  let count = 0;
  for (let i = 3; i < marks.length; i++) {
    if (marks[i].classList.contains("incorrect-mark")) {
      count++;
    }
  }

  for (let i = 3; i < inputs.length; i++) {
    if (inputs[i].value.length === 0) {
      count = 1;
    }
  }

  if (count > 0) {
    if (!addUserButton.classList.contains("disabled")) {
      addUserButton.classList.add("disabled");
    }
    addUserButton.disabled = true;
  } else {
    addUserButton.disabled = false;
    if (addUserButton.classList.contains("disabled")) {
      addUserButton.classList.remove("disabled");
    }
  }
}

function create(name, surname, department, avatar) {
  if (department !== undefined && avatar !== undefined) {
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("surname", surname.value);
    formData.append("avatar", avatar);
    formData.append("department_id", department);
    axios
      .post("https://momentum.redberryinternship.ge/api/employees", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.status);
        location.reload();
      })
      .catch((error) => {
        if (error.response) {
          console.log("Error response:", error.response.data);
          console.log("Error status:", error.response.status);
        } else {
          console.log("Error message:", error.message);
        }
      });
  }
}
