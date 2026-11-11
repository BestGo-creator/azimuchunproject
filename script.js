// Set this to your form-handling URL (it must accept a JSON POST and return a 2xx status on success).
// While it is empty, the form will NOT claim anything was submitted.
var SUBMIT_ENDPOINT = "";

var SPECIALIZATIONS = ["Information Technology","Software Development","Artificial Intelligence","Engineering","Robotics","Business and Entrepreneurship","Finance and Economics","Marketing","Design and Creative Arts","Science","Mathematics","Languages","Sports","Media and Communication","Other professional fields"];

var chips = document.getElementById("chips");
var spec = document.getElementById("spec");
var form = document.getElementById("form");
var statusEl = document.getElementById("status");

function select(name) {
  spec.value = name;
  Array.prototype.forEach.call(chips.children, function (c) {
    c.setAttribute("aria-pressed", c.textContent === name ? "true" : "false");
  });
}

SPECIALIZATIONS.forEach(function (name) {
  var b = document.createElement("button");
  b.type = "button"; b.className = "chip"; b.textContent = name;
  b.setAttribute("aria-pressed", "false");
  b.addEventListener("click", function () {
    select(name);
    statusEl.textContent = name + " selected. Complete the application form below.";
    statusEl.className = "status";
    document.getElementById("apply").scrollIntoView();
  });
  chips.appendChild(b);
  var o = document.createElement("option"); o.textContent = name; spec.appendChild(o);
});
spec.addEventListener("change", function () { select(spec.value); });

form.addEventListener("submit", function (e) {
  e.preventDefault();
  statusEl.className = "status";
  if (!form.checkValidity()) {
    statusEl.className = "status err";
    statusEl.textContent = "Please complete every field before submitting.";
    form.reportValidity();
    return;
  }
  if (!SUBMIT_ENDPOINT) {
    statusEl.className = "status err";
    statusEl.textContent = "Not sent. The online application system is not connected yet. Please call +998 88 700 14 41 to apply.";
    return;
  }
  var data = {};
  new FormData(form).forEach(function (v, k) { data[k] = v; });
  statusEl.textContent = "Sending...";
  fetch(SUBMIT_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    .then(function (r) {
      if (!r.ok) throw new Error("Server responded " + r.status);
      statusEl.textContent = "Application received. We will contact you using the details you provided.";
      form.reset(); select("");
    })
    .catch(function () {
      statusEl.className = "status err";
      statusEl.textContent = "Not sent. Something went wrong. Please try again or call +998 88 700 14 41.";
    });
});
