const department_api = "https://momentum.redberryinternship.ge/api/departments";
const token = "9e75d312-2d9f-4e7c-968f-c4f82f53a111";
const options = Array.from(document.querySelectorAll(".dropdown-list"));
const modal = document.querySelector(".department-select");

const inputs = Array.from(document.querySelectorAll(".inp"));

// everything[1].style.display = "block";
// everything[2].style.display = "flex";
// everything[3].style.display = "flex";

const everything = Array.from(document.body.children);
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

const txt = document.querySelector(".text");
const taskPageLogo = document.querySelector(".task-page-logo");
const taskPagePriority = document.querySelector(".task-page-priority");

const taskPage = document.querySelector(".task-page");

const taskPageDepartment = document.querySelector(".department");
const taskPageTaskHeader = document.querySelector(".task-page-task-header");
const taskPageDescription = document.querySelector(".task-page-description");
const firstOption = document.querySelector(".first-option");
const taskPageImage = document.querySelector(".task-page-employee-image");
const taskPageEmpDep = document.querySelector(".employee-detail-department");
const taskPageEmpName = document.querySelector(".employee-detail-name");
const taskPageDeadline = document.querySelector(".task-page-deadline");
const textareaComment = document.querySelector(".comment-body");

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
        div.id = element.id;
        let department_name;
        let department_color;
        let priority_color;
        switch (element.priority.id) {
          case 1:
            priority_color = "#08A508";
            break;
          case 2:
            priority_color = "#FFBE0B";
            break;
          case 3:
            priority_color = "#FA4D4D";
            break;
        }

        const short = returnShortText(element.department.name);
        department_color = short[0];
        department_name = short[1];

        const formattedDate = formatDate(element.due_date);

        div.innerHTML = `
          <div class="top">
            <div class="cont">
              <div style="border: 0.5px solid ${priority_color};" class="priority">
                <img class="logo" src="${element.priority.icon}">
                <div style="color: ${priority_color};" class="text">${element.priority.name}</div>
              </div>
              <div style="background-color: ${department_color};" class="department">${department_name}</div>
            </div>
            <div class="time">${formattedDate}</div>
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

        div.addEventListener("click", () => {
          everything[1].style.display = "none";
          everything[2].style.display = "none";
          everything[3].style.display = "none";
          taskPage.style.display = "flex";
          id = element.id;
          showTask(id);
          showComments(id);
          document
            .querySelector(".comment-btn")
            .addEventListener("click", () => {
              addComments(id, textareaComment.value, (employee_id = 1791));
            });
        });

        if (element.status.name === "დასაწყები") {
          document.querySelector(".starting").appendChild(div);
        } else if (element.status.name === "პროგრესში") {
          document.querySelector(".in-progress").appendChild(div);
          div.style.border = "1px solid #FB5607";
        } else if (element.status.name === "მზად ტესტირებისთვის") {
          document.querySelector(".testing-ready").appendChild(div);
          div.style.border = "1px solid #FF006E";
        } else {
          document.querySelector(".finished").appendChild(div);
          div.style.border = "1px solid #3A86FF";
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

function formatDate(datetime) {
  const months = [
    "იანვ",
    "თებ",
    "მარ",
    "აპრ",
    "მაი",
    "ივნ",
    "ივლ",
    "აგვ",
    "სექ",
    "ოქტ",
    "ნოე",
    "დეკ",
  ];
  const date = new Date(datetime);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

function format(inputDate) {
  const daysOfWeek = ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"];

  const date = new Date(inputDate);

  const dayOfWeek = daysOfWeek[date.getDay()];

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${dayOfWeek} - ${day}/${month}/${year}`;
}

function showTask(id) {
  axios
    .get(`https://momentum.redberryinternship.ge/api/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const data = response.data;
      console.log(data);
      taskPageDeadline.innerHTML = format(data.due_date);
      const short = returnShortText(data.department.name);
      taskPageDepartment.innerHTML = short[1];
      taskPageDepartment.style.backgroundColor = short[0];
      taskPageDescription.innerHTML = data.description;
      taskPageImage.src = data.employee.avatar;
      taskPageEmpName.innerHTML = `${data.employee.name} ${data.employee.surname}`;
      taskPageLogo.src = data.priority.icon;
      taskPageEmpDep.innerHTML = `${data.department.name}`;
      txt.innerHTML = data.priority.name;
      firstOption.innerHTML = data.status.name;
      let priority_color;
      switch (data.priority.id) {
        case 1:
          priority_color = "#08A508";
          break;
        case 2:
          priority_color = "#FFBE0B";
          break;
        case 3:
          priority_color = "#FA4D4D";
          break;
      }
      taskPagePriority.style.border = `0.5px solid ${priority_color}`;
      txt.style.color = priority_color;
    })
    .catch((error) => console.log(error));
}

function showComments(task) {
  axios
    .get(`https://momentum.redberryinternship.ge/api/tasks/${task}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const data = response.data;
      console.log(data);
    })
    .catch((error) => console.log(error));
}

function addComments(task, text, id) {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("parent_id", id);
  axios
    .post(
      `https://momentum.redberryinternship.ge/api/tasks/${task}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((response) => {
      console.log(response.status);
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

function returnShortText(text) {
  switch (text) {
    case "ადამიანური რესურსების დეპარტამენტი":
      return ["#e831e8", "რეს. დეპ."];
    case "ადმინისტრაციის დეპარტამენტი":
      return ["#f56767", "ადმ. დეპ"];
    case "ფინანსების დეპარტამენტი":
      return ["#47b847", "ფინანსები"];
    case "გაყიდვები და მარკეტინგის დეპარტამენტი":
      return ["#FD9A6A", "მარკეტინგი"];
    case "ლოჯოსტიკის დეპარტამენტი":
      return ["#89B6FF", "ლოჯისტიკა"];
    case "ტექნოლოგიების დეპარტამენტი":
      return ["#FFD86D", "ინფ. ტექ."];
    case "მედიის დეპარტამენტი":
      return ["#FF66A8", "მედია"];
  }
}
