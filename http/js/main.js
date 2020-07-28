round = 1;
yourScore = 0;
opponentScore = 0;
currentMove = -1;
takingInputs = false;
displayTimer = 5;
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
function changeOpacity(new_opacity) {
    document.getElementById("back2").style.opacity = new_opacity;
}
function displayOpponentSelection(ymove, result) {
    let option = "rock";
    if (ymove == 1) {
        option = "paper";
    } else if (ymove == 2) {
        option = "scissors";
    }
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
    if (option != 0) {
        document.getElementById("rock").style.opacity = 0;
    }
    if (option != 1) {
        document.getElementById("paper").style.opacity = 0;
    }
    if (option != 2) {
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
    let options = ["rock", "paper", "scissors"];
    options.forEach((option) => {
        document.getElementById(option).style.opacity = 1;
        document.getElementById(option).style.border = "none";
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
function updateStatus(statusText) {
    document.getElementById("status").innerText = statusText;
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
    updateStatus("Your move");
    takingInputs = true;
    displayAllSelections();
}
function opponentMove(ymove) {
    updateSmallMessage("Waiting for opponent's move.");
    takingInputs = false;
    displayYourSelection(ymove, 0);
}
function newGameScreen() {
    updateStatus("Choose your opponent type");
    document.getElementById("imageDiv2").style.display = "none";
    document.getElementById("footer").innerHTML =
        '<div id="roboDiv">\
        <span id="play">Play against:</span>\
        <label class="switch">\
            <input id="switch-input" type="checkbox" />\
            <span class="switch-label" data-on="Robot" data-off="Human"></span>\
            <span class="switch-handle"></span>\
        </label>\
        <button id="startButton">Start Game</button>\
    </div>';
    document.getElementById("startButton").addEventListener("click", startSearch);
}
function searchForOpponent() {
    let images = document.getElementsByClassName("image");
    for (image of images) {
        image.style.opacity = 0.5;
    }
    addMessages();
    document.getElementById("message").innerText = "Searching for human opponent";
    document.getElementById("smallMessage").innerHTML = '<span>Note: There have been</span> <span class="num">0</span> <span>human visitors in the last hour.</span>';
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
    sendHumanSearchRequest();
}
function addMessages() {
    let footer = document.getElementById("footer");
    footer.innerHTML = "";
    let message = document.createElement("span");
    message.id = "message";
    footer.appendChild(message);
    let smallMessage = document.createElement("div");
    smallMessage.id = "smallMessage";
    smallMessage.classList = "smallMessage";
    footer.appendChild(smallMessage);
}
function endIncompleteGame() {

}
function tieMove(ymove, omove) {
    youTiedRound();
    displayYourSelection(ymove, 0);
    displayOpponentSelection(omove, 0);
    startCountDown();
}
function winMove(ymove, omove) {
    youWinRound();
    displayYourSelection(ymove, 1);
    displayOpponentSelection(omove, -1);
    startCountDown();
}
function loseMove(ymove, omove) {
    youLoseRound();
    displayYourSelection(ymove, -1);
    displayOpponentSelection(omove, 1);
    startCountDown;
}
function countDownFrom5() {
    if (displayTimer == 0) {
        displayTimer = 5;
        clearInterval(countDown);
        yourMove();
    } else {
        document.getElementById("smallMessage").innerText = "Starting next round in " + displayTimer-- + " seconds.";
    }
}
function startCountDown() {
    countDown = setInterval(countDownFrom5, 1000);
    countDownFrom5();
}
function youWin() {

}
function opponentWins() {

}
function makeMove(move) {
    sendReq({"id": window.localStorage.getItem("gamerId"), "move": move}, "https://api.games.olmmcc.tk/make_move", () => {});
}
function checkStatus() {
    sendReq({"id": window.localStorage.getItem("gamerId")}, "https://api.games.olmmcc.tk/get_status_of_game", (json) => {
        if (json.status == 0) {
            if (json.waiting == 1) {
                if (waiting == 1) {
                    opponentMove(currentMove);
                } else {
                    document.getElementById("roundNum").innerText = ++round;
                    let outcome = (currentMove - json.opponentMove + 3) % 3;
                    if (outcome == 0) {
                        tieMove(currentMove, json.opponentMove);
                    } else if (outcome == 1) {
                        winMove(currentMove, json.opponentMove);
                        document.getElementById("yourScore").innerText = ++yourScore;
                    } else {
                        loseMove(currentMove, json.opponentMove);
                        document.getElementById("opponentScore").innerText = ++opponentScore;
                    }
                }
            }
        } else if (json.status == 2) {
            if (yourScore > opponentScore) {
                youWin();
            } else {
                opponentWins();
            }
        } else {
            clearInterval(statusChecker);
            endIncompleteGame();
        }
    });
}
function startGame(id) {
    document.getElementById("roundNum").innerText = "1";
    document.getElementById("id").innerText = id;
    displayAllSelections();
    updateMessage("Found an opponent!");
    waiting = false;
    yourMove();
    checkStatus();
    statusChecker = setInterval(checkStatus, 1000);
}
function startRobotGame() {
    sendReq({"id": window.localStorage.getItem("gamerId"), "type": "robot"}, "https://api.games.olmmcc.tk/new_game", (json) => {
        addMessages();
        startGame(json.id);
    });
}
function waitForGame(id) {
    sendReq({"id": window.localStorage.getItem("gamerId")}, "https://api.games.olmmcc.tk/get_status_of_game", (json) => {
        if (json.opponent_found) {
            clearInterval(dotdotdot);
            clearInterval(opponentWaiter);
            startGame(id);
        }
    });
}
function sendHumanSearchRequest() {
    sendReq({"id": window.localStorage.getItem("gamerId")}, "https://api.games.olmmcc.tk/search_for_human_game", (json) => {
        if (json.success) {
            clearInterval(searchAnimation);
            startGame(json.id);
        } else {
            sendReq({"id": window.localStorage.getItem("gamerId"), "type": "human"}, "https://api.games.olmmcc.tk/new_game", (json) => {
                waitForGame(json.id);
                opponentWaiter = setInterval(waitForGame, 1000, json.id);
            });
        }
    });
}
function startSearch() {
    if (window.localStorage.getItem("gamerId") == null) {
        sendReq({}, "https://api.games.olmmcc.tk/new_id", (json) => {
            window.localStorage.setItem("gamerId", json.id);
            determineGameType();
        });
    } else {
        determineGameType();
    }
}
function determineGameType() {
    if (document.getElementById("switch-input").checked) {
        startRobotGame();
    } else {
        searchForOpponent();
    }
}
function rockButton() {
    if (takingInputs) {
        makeMove(0);
    }
}
function paperButton() {
    if (takingInputs) {
        makeMove(1);
    }
}
function scissorsButton() {
    if (takingInputs) {
        makeMove(2);
    }
}
document.addEventListener('keydown', keydown);
closeButton = document.getElementById('closeNotification');
if (closeButton) {
    closeButton.addEventListener('click', closeNotification);
}
document.getElementById("rock").addEventListener("click", rockButton);
document.getElementById("paper").addEventListener("click", paperButton);
document.getElementById("scissors").addEventListener("click", scissorsButton);
changeOpacity(0.3);
newGameScreen();
//searchForOpponent();
//youLose();
//createNotification("Hi");
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
