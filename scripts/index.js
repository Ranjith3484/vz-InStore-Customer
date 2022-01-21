document.getElementById("detailsForm").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();
  var reason = getInputVal("callRequestReason");
  var comments = getInputVal("comments");
  localStorage.setItem("callReason", reason);
  localStorage.setItem("additionalComments", comments);
  window.location.replace("./customerCall.html");
}

// Function to get get form values
function getInputVal(id) {
  return document.getElementById(id).value;
}
