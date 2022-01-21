document.getElementById("detailsForm").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();
  var name = getInputVal("name");
  var phone = getInputVal("contactNumber");
  var reason = getInputVal("callRequestReason");
  localStorage.setItem("customerName", name);
  localStorage.setItem("customerPhone", phone);
  localStorage.setItem("callReason", reason);;
  window.location.replace("./customerCall.html");
}

// Function to get get form values
function getInputVal(id) {
  return document.getElementById(id).value;
}

//block texts in phone input
function onlyNumberKey(evt) {
    // Only ASCII character in that range allowed
    var ASCIICode = evt.which ? evt.which : evt.keyCode;
    if (ASCIICode === 43) {
      //allow + operator
      return true;
    } else if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false; //dont allow lettersor symbols
    return true;
  }