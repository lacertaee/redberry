const department_api = "https://momentum.redberryinternship.ge/api/departments";
const token = "9e71cf24-bbcd-4a20-9005-6e26629aa825";
const options = Array.from(document.querySelectorAll(".dropdown-list"));
const modal = document.querySelector(".form-select");

const inputs = Array.from(document.querySelectorAll(".inp"));

const first = document.querySelector(".first-name");
const marks = Array.from(document.querySelectorAll(".validate"));
const text = Array.from(document.querySelectorAll(".validate-text"));
const last = document.querySelector(".last-name");

const addUserButton = document.querySelector(".finish");
addUserButton.disabled = true;

const image = document.getElementById("image-input");
const trash = document.querySelector(".trash");
let img;

addUserButton.addEventListener("click", () => {
  console.log(1);
});

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
      }
    })
    .catch((error) => console.log(error));

  first.addEventListener("input", () => {
    validate(0, first);
  });

  last.addEventListener("input", () => {
    validate(2, last);
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
  // axios
  //   .get("https://momentum.redberryinternship.ge/api/tasks", {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //   .then((response) => {
  //     console.log(response.data);
  //   })
  //   .catch((error) => console.error(error));
});

function validate(num, input) {
  if (input.value.length < 2 || input.value.length > 255) {
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
    if (marks[1].classList.contains("correct-mark")) {
      marks[num + 1].classList.remove("correct-mark");
    }
    if (text[num + 1].classList.contains("correct-text")) {
      text[num + 1].classList.remove("correct-text");
    }
    marks[num].classList.add("incorrect-mark");
    text[num].classList.add("incorrect-text");
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
  const formData = new FormData();
  formData.append("avatar", avatar);
  formData.append("name", name);
  formData.append("surname", surname);
  formData.append("department_id", department);
}
