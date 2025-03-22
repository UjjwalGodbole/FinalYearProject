const openbox = document.getElementById('open');
const serachbox = document.querySelector('.serachbox');
const closebox = document.getElementById('close');
const openaccount = document.getElementById('openaccount');
const userbox = document.querySelector(".userbox");

//navigation
openbox.addEventListener("click",()=>{
    serachbox.style.display = "flex"
})
closebox.addEventListener("click",()=>{
    serachbox.style.display="none"
})
openaccount.addEventListener("click",()=>{
  if (userbox.style.display === "flex") {
    userbox.style.display = "none";
} else {
    userbox.style.display = "flex";
}
})
window.addEventListener("click", () => {
  userbox.style.display = "none";
});
openaccount.addEventListener("click", (event) => {
  event.stopPropagation();
});
userbox.addEventListener("click",(event)=>{
  event.stopPropagation();
})
// index.js
document.addEventListener("DOMContentLoaded", function () {
  const links = ['new', 'box', 'best', 'fiction'];

  links.forEach((id) => {
    const link = document.querySelector(`a[href="#${id}"]`);
    const section = document.querySelector(`#${id}`);

    if (link && section) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
          top: section.offsetTop - 100, // Adjust based on navbar height
          behavior: 'smooth'
        });
      });
    }
  });
});


  // login page
  document.addEventListener("DOMContentLoaded", () => {
    const openlogin = document.querySelector('.openlogin');
    const loginpage = document.querySelector('.loginpage');
    const loginclose = document.getElementById('loginclose');
  
    if (openlogin && loginpage && loginclose) {
      openlogin.addEventListener("click", () => {
        userbox.style.display="none";
        loginpage.style.display = "flex";
        document.body.classList.add("noscroll");
      });
  
      loginclose.addEventListener("click", () => {
        console.log("clicked");
        loginpage.style.display = "none";
        document.body.classList.remove("noscroll");
      });
  
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && loginpage.style.display === "block") {
          loginpage.style.display = "none";
          document.body.classList.remove("noscroll");
        }
      });
    }
  });

