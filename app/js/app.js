// Load the header
fetch("/app/layout/header.html")
  .then((response) => response.text())
  .then((content) => {
    document.getElementById("header").innerHTML = content;
  })
  .catch((error) => console.log(error));

// load the footer
fetch("/app/layout/footer.html")
  .then((response) => response.text())
  .then((content) => {
    document.getElementById("footer").innerHTML = content;
  })
  .catch((error) => console.log(error));
