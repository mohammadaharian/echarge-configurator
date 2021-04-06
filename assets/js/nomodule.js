console.warn("Unsupported browser");

var target = document.getElementById("configurator");

function removeChildren(element) {
	while(element.firstChild) {
		element.removeChild(element.lastChild);
	}
}

removeChildren(target);
target.insertAdjacentHTML("beforeend","<p style='text-align:center;'><strong>Outdated browser</strong><br><a href='https://www.microsoft.com/edge' target='blank_'>Click here to upgrade to a modern and faster browser</a></p>");