let IsACtive = true;
let NavOpen = false;




function loader(IsACtive) {
document.querySelector(".loaderBox").style.display = "flex";

if (IsACtive) {
  const Login_Con = document.querySelector(".Login_Con");
        Login_Con.style.display = "none";
        
        setTimeout(() => {
  const Login_Con = document.querySelector(".Login_Con");
        Login_Con.style.display = "flex";
  document.querySelector(".loaderBox").style.display = "none";
}, 3000)
        
} else {
  setTimeout(() => {
  document.querySelector(".main").style.display = "block";
  document.querySelector(".loaderBox").style.display = "none";
}, 100)
}

} 

function loader_Globel() {


setTimeout(()=> {
  document.querySelector('.main').style.display = "none";
  document.querySelector(".Chat_Box").style.display = "flex"
}, 00)
}


function OpenNavOrCloseNav() {
if (NavOpen) {
  document.querySelector(".Profile_Container").style.display = "none";
  NavOpen = false;
  document.querySelector('.main').style.filter = "none";
  document.querySelector(".Con").style.opacity = "0";
} else {
document.querySelector(".Profile_Container").style.display = "flex";

document.querySelector('.main').style.filter = 'blur(8px)';
document.querySelector(".Con").style.opacity = "1";
  NavOpen = true;
}
}

function CloseNav() {
  const cross = document.querySelector(".Cancel");
  document.querySelector(".Profile_Container").style.display = "none";
  NavOpen = true;
  document.querySelector('.main').style.filter = 'none';
}


function alertNow() {
  alert("something Went Wrong");
}


function Globel_chats() {
loader_Globel();
}


function CloseGlobel() {
  document.querySelector(".Chat_Box").style.display = "none";
  document.querySelector('.main').style.display = "block";
}