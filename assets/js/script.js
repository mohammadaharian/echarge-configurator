//import { coercive } from "./module/Extensions.mjs";
import { Configurator } from "./module/Configurator.mjs";

const searchParams = new URLSearchParams(window.location.search);
const echarge = new Configurator();

const api = {
    // Default data endpoints
    vehicles: "https://app.cloud.deltaco.eu/api/echarge-configurator/vehicles.json",
    cables: "cables.json",

    // Change the configurator header logo
    set logo(url = "assets/img/default_logo.jpg") {
        const target = document.getElementById("echargeLogo");
	    target.setAttribute("src",url);
    },

    // Change the configurator theme colors
    set color(color) {
        if(!color) {
            return false;
        }

        // Update each color in order
        const colors = searchParams.getAll("color");
        colors.forEach((color,index) => {
            let key = "";

            switch(index) {
                case 0: key = "accent"; break;
                case 1: key = "accent-hover"; break;
                case 2: key = "secondary"; break;
                default: return false;
            }

            document.body.style.setProperty(`--color-${key}`,`#${color}`);
        });
    }
}

// Initialize the configurator
function init() {
    // Fetch and assign vehicles from endpoint
    echarge.import(api.vehicles).then(data => {
        echarge.data.vehicles = data;
    }).then(() => {
        // Fetch and assign cables from endpoint
        echarge.import(api.cables).then(data => {
            echarge.data.cables = data;

            echarge.init(); // Initialize the configurator
        });
    });
}

// Change an api endpoint if a SearchParam is set
for(let endpoint in api) {
    const param = searchParams.get(endpoint);
    api[endpoint] = param ? param : api[endpoint];
}

init();
