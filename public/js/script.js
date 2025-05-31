// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()
// const toggleBtn = document.querySelector(".toggler-of-navbar");
// const navbarMenu = document.getElementById("navbarNavAltMarkup");
// const taxText = document.querySelector(".tax-text");

// if (toggleBtn && navbarMenu && taxText) {
//   toggleBtn.addEventListener("click", () => {
//     navbarMenu.classList.toggle("toggler-class");
//     taxText.classList.toggle("hidden");
//   });
// } else {
//   console.warn("Some elements are missing in the DOM.");
// }




