var tabList = ["home", "portfolio", "cars", "ind. study"]; // Visible tabs. Must be updated with names matching folders in /src/tabs

let getHash = () => location.hash.replace("#","").replace("%20","-"); // Get current anchor and replace "%20" with "-"

let updateHash = () => { // Replace "-" with " "
    document.querySelectorAll("#header .tab-selector button").forEach((elem) => {
        if (elem.innerText == getHash().replace("-", " ")) elem.dispatchEvent(new MouseEvent("click"));
    })
}

let addVisitedClass = (e) => e.target.classList.add("visited");

let attachVisitTrackers = () => {
    document.querySelectorAll("a").forEach((elem) => {
        elem.addEventListener("click", addVisitedClass);
        elem.addEventListener("touchend", addVisitedClass);
    })
}

// Tab select callback
let select = async (e) => {
    if (e.target.classList.contains("active")) return; // Do nothing if current tab is selected

    // Remove underlines from all tabs
    document.querySelectorAll("#header .tab-selector button").forEach((elem) => {
        elem.style.textDecoration = "none"
        elem.classList.remove("active");
    });

    location.hash = e.target.innerText;
    let name = getHash(); // Get name
    document.getElementById("title").innerText = "jamesbjenkins - " + name.replace("_", " "); // Update page title
    e.target.style.textDecoration = "underline"; // Add underline back under active tab
    e.target.classList.add("active");

    // Await html replacement before attaching trackers to links
    await new Promise (resolve => {
        fetch("src/tabs/" + name + "/index.html")
            .then(response => response.text())
            .then(text => {
                document.getElementById("content").innerHTML = text;
                resolve(); // Allow visit tracking to proceed
        });
    });

    attachVisitTrackers(); // Attaches a color class to dim links when visited, but resets on reload.

    try {
        document.getElementById("injected-script").src = "src/tabs/" + name + "/script.js"
    } catch (err) {
        console.log("No script found for this page.");
    }
}

let main = () => {
    // Background, might need other options for a light mode
    var newScript = document.createElement("script");
    newScript.src = "src/background.js";
    document.getElementById("body").appendChild(newScript);

    // Create tabs & buttons
    tabList.forEach((tabName) => {
        let button = document.createElement("button");
        button.innerText = tabName.replace("_", " ");
        button.addEventListener("click", select);
        button.addEventListener("touchend", select);
        document.querySelector("#header .tab-selector").appendChild(button);
    });

    // Go to home if no tab specified
    if (location.hash == "") location.hash = "#home";
    updateHash(); // Initial update call 
    // Redundant listener for the weird edge case where the user alters the anchor manually
    window.addEventListener("popstate", updateHash);
}

document.addEventListener("DOMContentLoaded", main);