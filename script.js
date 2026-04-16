document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

emailjs.init({
  publicKey: "nHBJHwrfbfuhJk7zl",
});

const form = document.getElementById("contact-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs.sendForm("service_1gzsu0v", "template_rbv0k9k", form)
    .then(() => {
      alert("Message sent successfully!");
      form.reset();
    })
    .catch((error) => {
      alert("Failed to send message.");
      console.error(error);
    });
});