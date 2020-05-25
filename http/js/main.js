round = 1;
yourScore = 0;
opponentScore = 0;
human = 1;
function closeNotification() {
    var element = document.getElementById("greyDiv");
    if (element != null) {
        element.parentNode.removeChild(element);
    }
}
function createNotification(notificationText) {
    closeNotification(); //Let's close other notifications first
    let greyDiv = document.createElement("div");
    greyDiv.id = 'greyDiv';
    greyDiv.innerHTML = "\
        <div id='notificationDiv'>\
        <p id='notificationP'>" + notificationText + "</p>\
        <svg id='closeNotification' viewBox='0, 0, 100, 100'>\
            <circle cx=50 cy=50 r=50 fill=black />\
            <rect class='whiteRect' y='55' rx=13 ry=13 x='-45' transform='rotate(-45 0 0)' width='90' height='25' />\
            <rect class='whiteRect' y='-15' rx=13 ry=13 x='25' transform='rotate(45 0 0)' width='90' height='25' />\
        </svg>\
        </div>";
    document.getElementById('body').appendChild(greyDiv);
    document.getElementById('closeNotification').addEventListener('click', closeNotification);
}
function keydown(event) {
    if (event.keyCode == 27) {
        closeNotification();
    }
}
document.addEventListener('keydown', keydown);
closeButton = document.getElementById('closeNotification');
if (closeButton) {
    closeButton.addEventListener('click', closeNotification);
}

function updateRound() {
    document.getElementById("roundNum").innerText = round;
}
function updateScore() {
    document.getElementById("yourScore").innerText = yourScore;
    document.getElementById("opponentScore").innerText = opponentScore;
}
function changeOpacity(new_opacity) {
    document.getElementById("back2").style.opacity = new_opacity;
}
function displayOpponentSelection(option, result) {
    let selection = document.getElementById("small" + option);
    selection.style.display = "inline";
    let color = "white";
    if (result == -1) {
        color = "red";
    } else if (result == 1) {
        color = "green";
    }
    selection.style.borderRadius = "10px";
    selection.style.border = "3px solid " + color;
}
function displayYourSelection(option, result) {
    let selection = document.getElementById(option.toLowerCase());
    if (option != "Rock") {
        document.getElementById("rock").style.opacity = 0;
    }
    if (option != "Paper") {
        document.getElementById("paper").style.opacity = 0;
    }
    if (option != "Scissors") {
        document.getElementById("scissors").style.opacity = 0;
    }
    selection.style.opacity = 1;
    let color = "white";
    if (result == -1) {
        color = "red";
    } else if (result == 1) {
        color = "green";
    }
    selection.style.borderRadius = "20px";
    selection.style.border = "5px solid " + color;
}
function displayAllSelections() {
    let options = ["Rock", "Paper", "Scissors"];
    options.forEach((option) => {
        document.getElementById(option.toLowerCase()).style.opacity = 1;
        document.getElementById(option.toLowerCase()).style.border = "none";
        document.getElementById("small" + option).style.display = "None";
    });
}
function updateMessage(messageText) {
    document.getElementById("message").innerText = messageText;
}
function updateSmallMessage(messageText) {
    document.getElementsByClassName("smallMessage")[0].remove();
    let newSmallMessage = document.createElement("span");
    newSmallMessage.classList = "smallMessage";
    newSmallMessage.innerText = messageText;
    document.getElementById("footer").appendChild(newSmallMessage);
}
function youLoseRound() {
    updateMessage("You lost round " + round + "!");
}
function youWinRound() {
    updateMessage("You win round " + round + "!");
}
function youTiedRound() {
    updateMessage("You tied round " + round + "!");
}
function youLose() {
    updateMessage("You lose!");
}
function youWin() {
    updateMessage("You win!");
}
function yourMove() {
    updateSmallMessage("Waiting for your move.");
}
function opponentMove() {
    updateSmallMessage("Waiting for opponent's move.");
}
function searchForOpponent() {
    document.getElementById("message").innerText = "Searching for human opponent";
    let images = document.getElementsByClassName("image");
    for (image of images) {
        image.style.opacity = 0.5;
    }
    let footer = document.getElementById("footer");
    let smallMessage = document.createElement("div");
    smallMessage.id = "smallMessage";
    smallMessage.classList = "smallMessage";
    smallMessage.innerHTML = '<span>Note: There have been</span> <span class="num">0</span> <span>human visitors in the last hour.</span>';
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
//youLose();
opponentMove();
updateRound();
updateScore();
createNotification("Hi");
//displayOpponentSelection("Paper", -1);
//displayYourSelection("Paper", 0);
//displayYourSelection("Paper", 1);
//displayAllSelections();

/*Searching

*/
/*Borders
border: 5px solid (red white green);
    border-radius: 20px;

border: 3px solid (green red);
    border-radius: 10px; 
*/
/*Actual opponent found
<span id="message">Found an opponent!</span>
<span id="message">You won round 1!</span>
<span id="message">You won!</span>
<span id="message">You lost!</span>

                <span></span>
                <span></span>
                */
/*Game id
<span id="id" class="num">1</span>
*/
