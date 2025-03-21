const filters = {
  დეპარტამენტი: [
    "მარკეტინგის დეპარტამენტი",
    "დიზაინის დეპარტამენტი",
    "ლოჯისტიკის დეპარტამენტი",
    "IT დეპარტამენტი",
  ],
  პრიორიტეტი: ["დაბალი", "საშუალო", "მაღალი"],
  თანამშრომელი: [],
};

const selectedFilters = {};

const buttonsContainer = document.querySelector(".filter-buttons-container");
const filterModal = document.querySelector(".filter-modal");
const modalContent = document.querySelector(".filter-values");
const closeModalBtn = document.querySelector(".close-modal");
const selectedFiltersContainer = document.querySelector(
  ".selected-filters-container"
);
const clearAllButton = document.querySelector(".clear-all-button");

selectedFiltersContainer.style.display = "none";

Object.keys(filters).forEach((filterName) => {
  const button = document.createElement("button");
  button.classList.add("dropdown-btn");
  button.innerHTML = filterName;

  button.addEventListener("click", (event) => {
    displayFilterValues(filterName, event.target);
  });

  buttonsContainer.appendChild(button);
});

function displayFilterValues(filterName, button) {
  modalContent.innerHTML = "";

  if (!selectedFilters[filterName]) {
    selectedFilters[filterName] = new Set();
  }

  filters[filterName].forEach((value) => {
    const filterItem = document.createElement("div");
    filterItem.classList.add("filter-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = value;
    checkbox.checked = selectedFilters[filterName].has(value);
    checkbox.addEventListener("change", (event) => {
      if (event.target.checked) {
        selectedFilters[filterName].add(value);
      } else {
        selectedFilters[filterName].delete(value);
      }
      updateSelectedFiltersDisplay();
    });

    const label = document.createElement("label");
    label.innerHTML = value;

    filterItem.appendChild(checkbox);
    filterItem.appendChild(label);
    modalContent.appendChild(filterItem);
  });

  const containerRect = buttonsContainer.getBoundingClientRect();
  console.log(containerRect);
  filterModal.style.top = `${containerRect.bottom + window.scrollY}px`;
  filterModal.style.left = `${containerRect.left + window.scrollX}px`;
  filterModal.style.width = `${containerRect.width}px`;
  filterModal.classList.remove("hidden");
}

function updateSelectedFiltersDisplay() {
  selectedFiltersContainer.innerHTML = "";

  let hasSelected = false;

  Object.keys(selectedFilters).forEach((filterName) => {
    selectedFilters[filterName].forEach((value) => {
      hasSelected = true;
      const chip = document.createElement("div");
      chip.classList.add("filter-chip");
      chip.innerText = `${filterName}: ${value}`;

      const closeButton = document.createElement("span");
      closeButton.innerHTML = "&times;";
      closeButton.classList.add("chip-close");
      closeButton.addEventListener("click", () => {
        selectedFilters[filterName].delete(value);
        updateSelectedFiltersDisplay();
      });

      chip.appendChild(closeButton);
      selectedFiltersContainer.appendChild(chip);
    });
  });

  if (hasSelected) {
    selectedFiltersContainer.style.display = "flex";
    clearAllButton.classList.remove("hidden");
  } else {
    selectedFiltersContainer.style.display = "none";
    clearAllButton.classList.add("hidden");
  }
}

function clearAllFilters() {
  Object.keys(selectedFilters).forEach((filterName) => {
    selectedFilters[filterName].clear();
  });
  updateSelectedFiltersDisplay();
}

clearAllButton.addEventListener("click", clearAllFilters);

closeModalBtn.addEventListener("click", () => {
  filterModal.classList.add("hidden");
});

document.addEventListener("click", (event) => {
  if (
    !filterModal.contains(event.target) &&
    !event.target.classList.contains("dropdown-btn")
  ) {
    filterModal.classList.add("hidden");
  }
});
