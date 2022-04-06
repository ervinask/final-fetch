const form = document.querySelector(".first-form");
const form2 = document.querySelector(".second-form");
let countryArr = [];

// Function that gets data for activities

const getDataActivity = async () => {
  try {
    const res = await fetch("http://18.193.250.181:1337/api/activities");
    const data = await res.json();
    if (data.data.length > 0) {
      data.data.forEach((activity) => {
        let createId = activity.attributes.title
          .split(" ")
          .join("")
          .toLowerCase();
        form.append(
          createElement(
            "div",
            { className: "checkbox-con" },
            createElement("input", {
              type: "checkbox",
              className: "checkbox",
              id: createId,
            }),
            createElement(
              "label",
              { className: "checkbox-text" },
              activity.attributes.title
            )
          )
        );
      });
    } else {
      document.querySelector(
        ".question"
      ).innerHTML = `<div class='errorMessage'>Refresh the page</div> `;
    }
  } catch (err) {
    document.querySelector(
      ".question"
    ).innerHTML = `<div class='errorMessage'>Refresh the page</div> `;
  }
};

// Append child function

function createElement(type, props, ...children) {
  const element = document.createElement(type); /// p
  if (props) Object.assign(element, props);

  for (let child of children) {
    if (typeof child === "string")
      element.appendChild(document.createTextNode(child));
    else element.appendChild(child);
  }
  return element;
}

getDataActivity();

// Click on first next button

document.querySelector(".first-form").addEventListener("submit", (e) => {
  let checkboxes = document.querySelectorAll(".checkbox");
  let activity = [];
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked === true) {
      activity.push(
        document.querySelectorAll(".checkbox-con > label")[index].textContent
      );
    }
    addToLocalStorage("activity", activity);
  });

  e.preventDefault();
  document.querySelector(".question-1").style.display = "none";
  document.querySelector(".question-2").style.display = "block";
  getDataCountry();
});

// Second question

const getDataCountry = async () => {
  try {
    const res = await fetch("http://18.193.250.181:1337/api/countries");
    const data = await res.json();
    const select = document.querySelector("#country");
    if (data.data.length > 0) {
      data.data.forEach((country) => {
        countryArr.push(country.attributes.country);
        const option = document.createElement("option");
        option.textContent = country.attributes.country;
        select.append(option);
      });
    } else {
      const option = document.createElement("option");
      option.textContent = "none";
      select.append(option);
      select.disabled = true;
    }
  } catch (err) {
    console.log(err);
  }
};

// Click on second next button

document.querySelector(".second-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let inputs = document.querySelectorAll(".input-text");

  let information = {
    first_name: inputs[0].value,
    last_name: inputs[1].value,
    email: inputs[2].value,
    country: inputs[3].value,
  };
  addToLocalStorage("information", information);
  document.querySelector(".question-2").style.display = "none";
  document.querySelector(".question-3").style.display = "block";
  informationDisplay();
});

// Third question

function informationDisplay() {
  let information = JSON.parse(localStorage.getItem("information"));
  document.querySelector(".information > .personal-info").innerHTML = "";
  document
    .querySelector(".information > .personal-info")
    .append(
      createElement("p", {}, information.first_name),
      createElement("p", {}, information.last_name),
      createElement("p", {}, information.email),
      createElement("p", {}, information.country)
    );
}

function addToLocalStorage(category, item) {
  localStorage.setItem(category, JSON.stringify(item));
}

// Submit all information or decline

document.querySelector(".confirm-button").addEventListener("click", () => {
  document.querySelector(".question-3").style.display = "none";
  document.querySelector(".question-4").style.display = "block";
  postInformation();
});

document.querySelector(".cancel-button").addEventListener("click", () => {
  document.querySelector(".question-3").style.display = "none";
  document.querySelector(".question-2").style.display = "block";
});

// Post information to backend

const postInformation = async () => {
  let information = JSON.parse(localStorage.getItem("information"));
  const res = await fetch("http://18.193.250.181:1337/api/people", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        first_name: information.first_name,
        last_name: information.last_name,
        email: information.email,
        country: countryArr.indexOf(information.country) + 1,
      },
    }),
  });
  const data = await res.json();
  console.log(data);
};
