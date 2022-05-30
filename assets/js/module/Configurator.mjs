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
        this.dict = ["Select car brand","Select model","Select year model"],
        this.data = {
            vehicles: {},
            cables: {}
        },

        this.translation = "i18n_en.json",
        this.language = "en",
        this.dictionary = {}
    }

    async import(url) {
        const response = await fetch(url);
        return response.json(); // parses JSON response into native JavaScript objects
    }

    // Get subset of cables from condition
    filterCables(predicate) {
        return Object.fromEntries(Object.entries(this.data.cables).filter(predicate))
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

        select.innerText = this.processTranslate(value);
        cursor.innerText = this.processTranslate(value);
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

    addItem(item) {
        return `<div class="item ${item.argument}">
                    <p class="length">${item.length}</p>
                        <img src="${item.image}"/>
                    <p class="info">${item.text}</p>
                    <a href="${item.link}" target="_blank">${this.processTranslate('Select')}</a>
                </div>`;
    }

    addAccessories() {
        const accessories = this.filterCables(([pid, prop]) => prop.argument === "noLength");

        for(const accessory of Object.values(accessories)) {
            this.UI.accessories.children[0].insertAdjacentHTML("beforeend", this.addItem(accessory));
        }

        this.UI.accessories.classList.add("active");
    }

    openSummary() {
        this.UI.wrapper.style.display = "none";
        const data = this.data.vehicles[this.configuration[0]][this.configuration[1]][this.configuration[2]];

        // Set vehicle info fields
        let bannerText = this.UI.summary.querySelector("#banner").children;
        bannerText[1].innerText = this.configuration[0];
        bannerText[3].innerText = data.charger.type;
        bannerText[5].innerText = data.charger.speed;
        bannerText[7].innerText = data.charger.phase;

        let i = 0;
        data.cables.forEach(cable => {
            if(i >= 4) {
                return false;
            }
            const data = this.data.cables[cable];
            if(cable in this.data.cables) {
                this.UI.cables.innerHTML += this.addItem(data);
                i++;
            }
        });
        
        // Accessory items
        this.addAccessories();

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

        /**
         * process translation file
         * then proceed with translation
         */
        const searchParams = new URLSearchParams(window.location.search);
        const param = searchParams.get('translation');
        const json = param ? param : this.translation;

        this.import(json).then(data => {
            this.dictionary = data;
            this.language = Object.keys(this.dictionary)[0];
            this.translate();
        });

    }

    translate(DOMContainer, lang){
        const language = lang || this.language;
        const container = DOMContainer || typeof document === 'object' ? document : null;

        console.log(container);

        if (container) {
            const elements = container.querySelectorAll('[translator]');
            elements.forEach((element) => this.translateElement(element, language));
        }
    }

    translateElement(DOMElement, lang) {
        if (DOMElement) {
            const language = lang || this.language;
            const input = DOMElement.textContent || DOMElement.innerText;
            const html = DOMElement.attributes['translate-html'] ? true : false;

            DOMElement[
                    html
						? 'innerHTML'
						: 'textContent'
            ] = this.processTranslate(input, {lang: language});
        }
    }

    processTranslate(input = '', options = {}) {
        const language = options.lang || this.language;
        let output = this.dictionary.hasOwnProperty(this.language);

        console.log(this.dictionary);
        console.log(language);
        console.log(output);

        if (output) {
            output = this.dictionary[language][input];
        }

        console.log(output);

        return output ? output : input;
    }
}