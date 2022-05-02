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

<p id="instructions" class="content is-size-5 m-5">
    <strong>Instructions:</strong>
    <br>
    - Beat the levels as fast as you can while collecting pickups!
    <br>
    - <strong>HINT:</strong> beat the game in under a minute while collecting at least 10 crowns for a special reward!
    <br><br>
    <strong>Controls:</strong>
    <br>
    - 'Enter' to begin the game
    <br> 
    - W to jump, A and D to move
</p>

`;

class MyInstructions extends HTMLElement {
    constructor() {
        super();

        // 1 - Attach a shadow DOM tree to this instance - this creates `.shadowRoot` for us
        this.attachShadow({ mode: "open" });

        // 2 - clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

    }

    /**
     * This function is calling connected call back to initialize the burger icon menu
     */
    connectedCallback() {
        
    }

    /**
     * This method runs when the component is destroyed
     */
    disconnectedCallback() {
        
    }

} // end class

customElements.define('my-instructions', MyInstructions);