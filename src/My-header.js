const template = document.createElement("template");
template.innerHTML = `
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>

<style>
    #title {
        font-family: 'Press Start 2P', cursive;
        font-size: 36px;
    }
</style>

<header>
    <nav class="navbar py-4 pl-4 has-background-danger-light">
        <div class="navbar-brand">
            <h1 id="title">Jello Jump!</h1>
            <a class="navbar-item" href="about.html">
                <i class="fabrands fa-bilibili">
            </i></a>
            <a class="navbar-burger" id="burger">
                <span></span>
                <span></span>
                <span></span>
            </a>
        </div>

        <div class="navbar-menu" id="nav-links">
            <a href="about.html" class="navbar-item">About</a>
            <a href="app.html" class="navbar-item">Apps</a>
            <a href="documentation.html" class="navbar-item">Documentation</a>
        </div>
    </nav>
</header>
`;

class MyHeader extends HTMLElement {
    constructor() {
        super();

        // 1 - Attach a shadow DOM tree to this instance - this creates `.shadowRoot` for us
        this.attachShadow({ mode: "open" });

        // 2 - clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.nav = this.shadowRoot.querySelector("nav");

        // mobile menu
        this.burgerIcon = this.shadowRoot.querySelector("#burger");
        this.navbarMenu = this.shadowRoot.querySelector("#nav-links");
    }

    /**
     * This function is calling connected call back to initialize the burger icon menu
     */
    connectedCallback() {
        this.burgerIcon.addEventListener('click', () => {
            this.navbarMenu.classList.toggle('is-active');
        })
    }

    /**
     * This method runs when the component is destroyed
     */
    disconnectedCallback() {
        this.burgerIcon.removeEventListener('click', () => {
            this.navbarMenu.classList.toggle('is-not-active');
        })
    }

} // end class

customElements.define('my-header', MyHeader);