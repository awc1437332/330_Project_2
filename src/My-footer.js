const template = document.createElement("template");
template.innerHTML = `
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
    integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<style>
footer {
    font-family: 'Press Start 2P', cursive;
    font-size: 24px;
}
</style>
<footer class="footer py-4">
    &copy Andrew Carbonari & Louis D'Angelo 2022
</footer>
`;


class MyFooter extends HTMLElement {
    constructor(){
        super();

        // 1 - Attach a shadow DOM tree to this instance - this creates `.shadowRoot` for us
        this.attachShadow({mode: "open"});

        // 2 - clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.footer = this.shadowRoot.querySelector("footer");
    }
} // end class

customElements.define('my-footer', MyFooter);