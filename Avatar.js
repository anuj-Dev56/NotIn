const name = document.querySelector(".name");
const email_box = document.querySelector(".email_box");

function SetUp_profile(UserName, FullEmail) {
  name.innerHTML = localStorage.getItem("User_Name") || UserName;
  email_box.innerHTML = FullEmail;
}

