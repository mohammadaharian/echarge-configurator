export class Configurator {
    constructor() {
        this.section = 0, // Current configurator section
        this.configuration = ["","",""],
        this.UI = {
            wrapper: document.querySelector("#configurator"),
            select: document.querySelector("#select"),
            cursor: document.querySelector("#cursor"),
            dropdown: document.querySelector("#dropdown"),
            summary: document.querySelector("#summary"),
            cables: document.querySelector("#cables"),
            accessories: document.querySelector("#accessories")
        },
        this.dict = ["Välj bilmärke","Välj modell","Välj årsmodell"],
        this.data = {
            vehicles: {},
            cables: {}
        }
    }

    async import(url) {
        const response = await fetch(url);
        return response.json(); // parses JSON response into native JavaScript objects
    }

    // Set dropdown visibility
    dropdownVisible(show) {
        if(!show) {
            this.UI.wrapper.classList.remove("dropdownActive");
            return false;
        }
        this.UI.wrapper.classList.add("dropdownActive");
    }

    // Returns true if dropdown is visible
    getDropdownVisibility() {
        if(this.UI.wrapper.classList.contains("dropdownActive")) {
            return true;
        }
        return false;
    }

    // Populate dropdown with values
    setDropdownData(section) {
        let dropdownInner = this.UI.dropdown.children[0]; // Target inner <div>
        let data;

        switch(section) {
            case 0: 
                data = this.data.vehicles; 
                break;
            case 1:
                data = this.data.vehicles[this.configuration[0]];
                break;
            case 2:
                data = this.data.vehicles[this.configuration[0]][this.configuration[1]];
                break;
        }

        dropdownInner.textContent = ""; // Clear existing elements
        for(let key in data) {
            const element = document.createElement("p");
            const node = document.createTextNode(key);
            element.setAttribute("data",key);
            element.appendChild(node);

            dropdownInner.appendChild(element);
        }; 
    }

    // Restore placeholder text from dictionary
    resetValue(section) {
        if(section > 2) {
            return false;
        }
        // Get the inner <p> of elements
        const select = this.UI.select.children[section].children[0],
              cursor = this.UI.cursor.children[0].children[section],
              value = this.dict[section];

        select.innerText = value;
        cursor.innerText = value;
    }

    // Set the active section
    setSection(section) {
        this.dropdownVisible(false);
        this.setDropdownData(section);

        // If user backtracks
        if(section < this.section) {
            for(let i = section; i < this.section - (section - 1); i++) {
                this.resetValue(i);
            }
        }

        this.section = section;
        this.UI.wrapper.classList = "select" + section;
    }

    // Event handler for dropdown clicks
    // Set section value from dropdown text
    setValue(target) {
        if(target.nodeName != "P") {
            return false;
        }

        // Set text of cursor element to value
        const cursorText = this.UI.cursor.children[0];
        cursorText.children[this.section].innerText = target.innerText;
        
        // Set text of the select element to value
        this.UI.select.children[this.section].children[0].innerText = target.innerText;
        this.dropdownVisible(false);

        this.configuration[this.section] = target.innerText;

        if(this.section < 3) {
            this.setSection(this.section + 1);
            return false;
        }
    }

    openSummary() {
        this.UI.wrapper.style.display = "none";
        const data = this.data.vehicles[this.configuration[0]][this.configuration[1]][this.configuration[2]];

        function addItem(cable) {
            return `<div class="item ${cable.argument}"><p class="length">${cable.length}</p><img src="${cable.image}"/><p class="info">${cable.text}</p><a href="${cable.link}" target="_blank">Välj</a></div>`;
        }

        // Set vehicle info fields
        let bannerText = this.UI.summary.querySelector("#banner").children;
        bannerText[0].innerText = this.configuration[0];
        bannerText[1].innerText = data.charger.type;
        bannerText[2].innerText = data.charger.speed;
        bannerText[3].innerText = data.charger.phase;

        let i = 0;
        data.cables.forEach(cable => {
            if(i >= 4) {
                return false;
            }
            const data = this.data.cables[cable];
            if(cable in this.data.cables) {
                this.UI.cables.innerHTML += addItem(data);
                i++;
            }
        });
        
        // Accessory items
        this.UI.cables.innerHTML += addItem(this.data.cables["EV-5100"]);
        if(i > 3) {
            this.UI.accessories.classList.add("active");
            this.UI.accessories.children[0].innerHTML = addItem(this.data.cables["EV-5100"]);
        }

        this.UI.summary.classList.add("active");
    }

    // Event handler for select clicks
    select(target) {
        // Toggle dropdown if active or not an option range
        if(!target || !target.classList.contains("option") || this.getDropdownVisibility() == true) {
            this.dropdownVisible(false);
            return false;
        }

        // Get which section the select belongs to and move back if less than current
        const select = parseInt(target.getAttribute("data"));

        // Open summary
        if(select == 3) {
            this.openSummary();
            return false;
        }

        // If user backtracks
        if(select < this.section) {
            this.setSection(select);
        }

        this.dropdownVisible(true);
    }

    // Configurator entry point
    init() {
        this.UI.select.addEventListener("click",event => this.select(event.target));
        this.UI.dropdown.addEventListener("click",event => this.setValue(event.target));
        this.UI.accessories.addEventListener("click",() => this.UI.summary.classList.toggle("accessoriesActive"));

        this.setDropdownData(0);
    }
}