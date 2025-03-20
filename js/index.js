const department_api = "https://momentum.redberryinternship.ge/api/departments";
const token = "9e75d312-2d9f-4e7c-968f-c4f82f53a111";
const options = Array.from(document.querySelectorAll(".dropdown-list"));
const modal = document.querySelector(".department-select");

const inputs = Array.from(document.querySelectorAll(".inp"));

const first = document.querySelector(".first-name");
let marks = Array.from(document.querySelectorAll(".validate"));
let text = Array.from(document.querySelectorAll(".validate-text"));
const last = document.querySelector(".last-name");

const addUserButton = document.querySelector(".finish");
addUserButton.disabled = true;

const image = document.getElementById("image-input");
const trash = document.querySelector(".trash");
let img;

const addUser = document.querySelector(".finish");
let department;

const addTask = document.querySelector(".add-task");

const headerInput = document.querySelector(".add-task-header");
const descriptionInput = document.querySelector(".add-task-description");

document.addEventListener("DOMContentLoaded", () => {
  axios
    .get("https://momentum.redberryinternship.ge/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const data = response.data;
      data.forEach((element) => {
        const div = document.createElement("div");
        div.classList.add("item");

        div.innerHTML = `
          <div class="top">
            <div class="cont">
              <div class="priority">
                <div class="logo">${element.priority.icon}</div>
                <div class="text">${element.priority.name}</div>
              </div>
              <div class="department">${element.department.name}</div>
            </div>
            <div class="time">${element.due_date}</div>
          </div>
          <div class="middle">
            <div class="middle-first">${element.name}</div>
            <div class="middle-second">${element.description}</div>
          </div>
          <div class="bottom">
            <img src="${element.employee.avatar}" class="photo">
            <div class="comment-container">
              <img src="../images/Comments.png" width="22px" alt="">
              <div class="comment">${element.total_comments}</div>
            </div>
          </div>
        `;

        if (element.status.name === "დასაწყები") {
          document.querySelector(".starting").appendChild(div);
        } else if (element.status.name === "პროგრესში") {
          document.querySelector(".in-progress").appendChild(div);
        } else if (element.status.name === "მზად ტესტირებისთვის") {
          document.querySelector(".testing-ready").appendChild(div);
        } else {
          document.querySelector(".finished").appendChild(div);
        }
      });
    })
    .catch((error) => console.error(error));

  axios
    .get(department_api)
    .then((response) => {
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.text = data[i].name;
        option.id = data[i].id;
        modal.appendChild(option);
      }
    })
    .catch((error) => console.log(error));

  axios
    .get("https://momentum.redberryinternship.ge/api/statuses")
    .then((response) => {
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.text = data[i].name;
        option.id = data[i].id;
        modal.appendChild(option);
      }
    })
    .catch((error) => console.log(error));

  first.addEventListener("input", () => {
    validate(0, first);
  });

  last.addEventListener("input", () => {
    validate(2, last);
  });

  modal.addEventListener("change", (event) => {
    department = Number(event.target.selectedOptions[0].id);
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

  addUser.addEventListener("click", () => {
    create(first, last, department, img);
  });

  trash.addEventListener("click", () => {
    const show = document.querySelector(".img");
    show.removeAttribute("style");
    show.src = "../images/Frame 1000005790.png";
    document.querySelector(".upload-image-text").style.display = "block";
    trash.style.display = "none";
    image.style.display = "block";
  });

  addTask.addEventListener("click", () => {
    window.location.assign("../html/new-task.html");
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
  marks.forEach((element) => {
    if (element.classList.contains("incorrect-mark")) {
      count++;
    }
  });
  inputs.forEach((element) => {
    if (element.value.length === 0) {
      count = 1;
    }
  });
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
