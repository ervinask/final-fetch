let people = document.querySelector(".people-display");
let searchas = document.querySelector("#search-name");
let countryArr = [];

const get = async () => {
  try {
    const res = await fetch(
      "http://18.193.250.181:1337/api/people?populate=*&pagination[pageSize]=100"
    );
    const data = await res.json();

    if (data.data.length > 0) {
      // Visitors display
      document.querySelector(".number-visitors").textContent = Math.round(
        Math.random() * 5000 + 5000
      );

      // Total Signups display
      document.querySelector(".number-signups").textContent =
        data.meta.pagination.total;

      // Number of different countries
      let countryCount = [];
      data.data.forEach((element) => {
        if (element.attributes.country.data) {
          countryCount.push(element.attributes.country.data.id);
        }
      });
      document.querySelector(".number-countries").textContent = [
        ...new Set(countryCount),
      ].length;

      // Number of users that first name or last name non capitalized
      document.querySelector(".number-noncap").innerHTML = data.data.filter(
        (word) =>
          word.attributes.first_name[0] !==
            word.attributes.first_name[0].toUpperCase() ||
          word.attributes.last_name[0] !==
            word.attributes.last_name[0].toUpperCase()
      ).length;

      // Display of each human
      data.data.forEach((element) => {
        // Getting country id to display country
        let countryDis = "other";
        if (element.attributes.country.data)
          countryDis = countryArr[element.attributes.country.data.id - 1];

        // Appending information
        people.append(
          createElement(
            "div",
            { className: "hum-info" },
            createElement(
              "div",
              { className: "firstline" },
              createElement(
                "p",
                { className: "icon" },
                element.attributes.first_name[0] +
                  element.attributes.last_name[0]
              ),
              createElement(
                "div",
                { className: "main-info" },
                createElement(
                  "p",
                  { className: "name-surname" },
                  element.attributes.first_name +
                    " " +
                    element.attributes.last_name
                ),
                createElement(
                  "p",
                  { className: "email" },
                  element.attributes.email
                )
              )
            ),
            createElement("p", { className: "country" }, countryDis)
          )
        );
      });
    } else {
      document.querySelector(
        ".people-display"
      ).innerHTML = `<p class="errormsg">Registrations not found</p>`;
    }
  } catch (err) {
    document.querySelector(
      ".people-display"
    ).innerHTML = `<p class="errormsg">Data not found</p>`;
    console.log(err);
  }
};

// Append child function

function createElement(type, props, ...children) {
  const element = document.createElement(type); /// p
  if (props) Object.assign(element, props);

  for (let child of children) {
    if (typeof child === "string")
      element.appendChild(document.createTextNode(child));
    else element.append(child);
  }
  return element;
}

// Filter ////////////////////////////////////////////

// On text input
searchas.addEventListener("input", () => {
  people.innerHTML = "";
  displayRooms();
});

// On country change
document.querySelector("#search-country").addEventListener("input", () => {
  people.innerHTML = "";
  displayRooms();
});

// Function that change inputs
const displayRooms = async () => {
  let indexx = "";
  if (document.querySelector("#search-country").value) {
    indexx =
      countryArr.indexOf(document.querySelector("#search-country").value) + 1;
  }
  let url = `http://18.193.250.181:1337/api/people?populate=*&pagination[pageSize]=100&filters[$or][0][first_name][$containsi]=${searchas.value}&filters[$or][1][last_name][$containsi]=${searchas.value}&filters[country][id][$contains]=${indexx}`;
  const res = await fetch(url);
  const data = await res.json();
  data.data.forEach((element) => {
    let countryDis = "other";
    if (element.attributes.country.data)
      countryDis = countryArr[element.attributes.country.data.id - 1];

    people.append(
      createElement(
        "div",
        { className: "hum-info" },
        createElement(
          "div",
          { className: "firstline" },
          createElement(
            "p",
            { className: "icon" },
            element.attributes.first_name[0] + element.attributes.last_name[0]
          ),
          createElement(
            "div",
            { className: "main-info" },
            createElement(
              "p",
              { className: "name-surname" },
              element.attributes.first_name + " " + element.attributes.last_name
            ),
            createElement("p", { className: "email" }, element.attributes.email)
          )
        ),
        createElement("p", { className: "country" }, countryDis)
      )
    );
  });
};

// Create options for select

const getDataCountry = async () => {
  try {
    const res = await fetch("http://18.193.250.181:1337/api/countries");
    const data = await res.json();
    const select = document.querySelector("#search-country");
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

getDataCountry();
get();
