const menu = document.getElementById("menu")
const center = document.getElementById("center")
const menuImg = document.getElementById('menu-img')

menu.addEventListener('click', () => {
    if ((center.style.display = "none")) {
        center.style.display = 'flex'
        menuImg.setAttribute("src", "");
    } else {
        center.style.display = "none";
    }
})