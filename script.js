var tabList = ["home", "portfolio", "bugs", "ind._study"]; // must be updated w/ names matching html

let getHash = () => location.hash.replace("#","").replace("%20","_");

let update = () => {
    document.querySelectorAll("#header .tab-selector button").forEach((elem) => {
        if (elem.innerText == getHash().replace("_", " ")) elem.dispatchEvent(new MouseEvent("click"));
    })
}

// tab select callback
let select = (e) => {
    // remove underlines from tabs
    document.querySelectorAll("#header .tab-selector button").forEach((elem) => {
        elem.style.textDecoration = "none"
        elem.classList.remove("active");
    });

    location.hash = e.target.innerText;
    let name = getHash(); // get name
    document.getElementById("title").innerText = "jamesbjenkins - " + name.replace("_", " "); // update page title
    e.target.style.textDecoration = "underline"; // add underline back under active tab
    e.target.classList.add("active");

    // using fetch :(
    fetch("resources/tabs/" + name + ".html").then((response) => {
        return response.text().then((text) => {
            document.getElementById("content").innerHTML = text;
        });
    });
}

let main = () => {
    // background, might need other options for a light mode
    var newScript = document.createElement("script");
    newScript.src = "resources/background.js";
    document.getElementById("body").appendChild(newScript);

    // create tabs & buttons
    tabList.forEach((tabName) => {
        let button = document.createElement("button");
        button.innerText = tabName.replace("_", " ");
        button.addEventListener("click", select);
        button.addEventListener("touchend", select);
        document.querySelector("#header .tab-selector").appendChild(button);
    });

    // go to home if no tab specified
    if (location.hash == "") location.hash = "#home";
    update(); // initial update call 
    // redundant listener for the weird edge case where the user alters the anchor manually
    window.addEventListener("popstate", update);
}

document.addEventListener("DOMContentLoaded", main);