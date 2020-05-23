function changeOpacity(new_opacity) {
    document.getElementById("back2").style.opacity = new_opacity;
}
function searchForOpponent() {
    document.getElementById("message").innerText = "Searching for human opponent";
    let footer = document.getElementById("footer");
    let smallMessage = document.createElement("div");
    footer.appendChild(smallMessage);
    let status = document.getElementById("status");
    let searchAnimation = () => {
        status.innerHTML = "&nbsp".repeat(3 - phase) + ".".repeat(phase) + "&nbsp;Searching for opponent&nbsp;" + ".".repeat(phase) + "&nbsp".repeat(3 - phase);
        if (++phase == 4) {
            phase = 0;
        }
    };
    let phase = 0;
    searchAnimation();
    dotdotdot = setInterval(searchAnimation, 1000);
}
changeOpacity(0.3);
searchForOpponent();

/*Searching
<span id="message">Searching for human opponent.</span>
                <div id="smallMessage">
                    <span>Note: There have been</span>
                    <span class="num">0</span>
                    <span>human visitors in the last hour.</span>
                </div>

opacity: 0.5;
*/
/*Borders
border: 5px solid (red white green);
    border-radius: 20px;

border: 3px solid (green red);
    border-radius: 10px; 
*/
/*Actual opponent found
<span id="message">Found an opponent!</span>
<span id="message">You lost round 1!</span>
<span id="message">You won round 1!</span>
<span id="message">You won!</span>
<span id="message">You lost!</span>

                <span>Waiting for your move.</span>
                <span>Waiting for opponent's move.</span>
                */
/*Game id
<span id="id" class="num">1</span>
*/
