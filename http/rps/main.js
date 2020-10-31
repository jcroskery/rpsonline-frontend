round = 1;
yourScore = 0;
opponentScore = 0;
takingInputs = false;
displayTimer = 3;
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
    let selection;
    if (option == 0) {
        selection = document.getElementById("rock");
        document.getElementById("paper").style.opacity = 0;
        document.getElementById("scissors").style.opacity = 0;
    } else if (option == 1) {
        document.getElementById("rock").style.opacity = 0;
        selection = document.getElementById("paper");
        document.getElementById("scissors").style.opacity = 0;
    } else {
        document.getElementById("rock").style.opacity = 0;
        document.getElementById("paper").style.opacity = 0;
        selection = document.getElementById("scissors");
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
function youLoseRound() {
    updateMessage("You lost round " + round + "!");
}
function youWinRound() {
    updateMessage("You won round " + round + "!");
}
function youTiedRound() {
    updateMessage("You tied round " + round + "!");
}
function yourMove() {
    updateSmallMessage("Waiting for your move.");
    takingInputs = true;
    displayAllSelections();
}
function makeOpponentMove(ymove) {
    updateSmallMessage("Waiting for opponent's move.");
    displayYourSelection(ymove, 0);
}
function newGameScreen() {
    document.getElementById("mainLeft").addEventListener("click", () => {
        checkId(searchForOpponent);
    });
    document.getElementById("mainCentre").addEventListener("click", () => {
        checkId(startRobotGame);
    });
    document.getElementById("mainRight").addEventListener("click", () => {window.location = "/"});
}
function searchForOpponent() {
    displayGameScreen();
    let images = document.getElementsByClassName("image");
    for (image of images) {
        image.style.opacity = 0.5;
    }
    addMessages();
    document.getElementById("smallMessage").innerHTML = '';
    let message = document.getElementById("message");
    let searchAnimation = () => {
        message.innerHTML = "&nbsp".repeat(3 - phase) + ".".repeat(phase) + "&nbsp;Searching for opponent&nbsp;" + ".".repeat(phase) + "&nbsp".repeat(3 - phase);
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
    updateMessage("Your opponent left the game.");
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
}
function loseMove(ymove, omove) {
    youLoseRound();
    displayYourSelection(ymove, -1);
    displayOpponentSelection(omove, 1);
}
function countDownFrom3() {
    if (displayTimer == 0) {
        displayTimer = 3;
        clearInterval(countDown);
        statusChecker = setInterval(checkStatus, 1000);
        document.getElementById("roundNum").innerText = ++round;
        yourMove();
    } else {
        updateSmallMessage("Starting next round in " + displayTimer-- + " seconds.");
    }
}
function startCountDown() {
    countDown = setInterval(countDownFrom3, 1000);
    countDownFrom3();
}
function youWin() {
    updateMessage("You won!");
    updateSmallMessage("The score was " + yourScore + " to " + opponentScore + ".");
}
function opponentWins() {
    updateMessage("Your opponent won!");
    updateSmallMessage("The score was " + yourScore + " to " + opponentScore + ".");
}
function makeMove(move) {
    if (takingInputs) {
        takingInputs = false;
        sendReq({ "id": window.localStorage.getItem("gamerId"), "move": move.toString() }, "https://api.games.olmmcc.tk/make_move", () => { });
    }
}
function checkStatus() {
    sendReq({ "id": window.localStorage.getItem("gamerId") }, "https://api.games.olmmcc.tk/get_status_of_game", (json) => {
        if (json.status == 0 || json.status == 2) {
            if (json.waiting == 1) {
                makeOpponentMove(json.your_move);
            } else if (json.opponent_move != null && json.round == round) {
                let opponentMove = parseInt(json.opponent_move);
                let outcome = (json.your_move - opponentMove + 3) % 3;
                if (outcome == 0) {
                    tieMove(json.your_move, opponentMove);
                } else if (outcome == 1) {
                    document.getElementById("yourScore").innerText = ++yourScore;
                    winMove(json.your_move, opponentMove);
                    if (json.status == 2) {
                        clearInterval(statusChecker);
                        youWin();
                    } else {
                        startCountDown();
                    }
                } else {
                    loseMove(json.your_move, opponentMove);
                    document.getElementById("opponentScore").innerText = ++opponentScore;
                    if (json.status == 2) {
                        clearInterval(statusChecker);
                        opponentWins();
                    } else {
                        startCountDown();
                    }
                }
                clearInterval(statusChecker);
            }
        } else {
            clearInterval(statusChecker);
            endIncompleteGame();
        }
    });
}
function displayGameScreen(id = "None") {
    document.getElementById("mainScreen").classList.add("none");
    document.getElementById("mainScreen").classList.remove("inline-flex");
    document.getElementById("imageDiv2").style.display = "initial";
    document.getElementById("imageDiv1").style.display = "inline-flex";
    document.getElementById("headerDiv").style.display = "inline-flex";
    document.getElementById("footer").style.display = "inline-flex";
    round = 1;
    yourScore = 0;
    opponentScore = 0;
    takingInputs = false;
    document.getElementById("roundNum").innerText = "1";
    document.getElementById("id").innerText = id;
    document.getElementById("yourScore").innerText = yourScore;
    document.getElementById("opponentScore").innerText = opponentScore;
    displayAllSelections();
}
function startGame(id) {
    displayGameScreen(id);
    updateMessage("Found an opponent!");
    yourMove();
    checkStatus();
    statusChecker = setInterval(checkStatus, 1000);
}
function goToMainMenu() {
    document.getElementById("headerDiv").style.display = "none";
    document.getElementById("imageDiv1").style.display = "none";
    document.getElementById("footer").style.display = "none";
    document.getElementById("imageDiv2").style.display = "none";
    document.getElementById("mainScreen").classList.add("inline-flex");
    document.getElementById("mainScreen").classList.remove("none");
    if (typeof statusChecker !== "undefined") {
        clearInterval(statusChecker);
    }
    if (typeof opponentWaiter !== "undefined") {
        clearInterval(opponentWaiter);
    }
    if (typeof dotdotdot !== "undefined") {
        clearInterval(dotdotdot);
    }
    if (typeof countDown !== "undefined") {
        clearInterval(countDown);
    }
}
function startRobotGame() {
    sendReq({ "id": window.localStorage.getItem("gamerId"), "type": "robot" }, "https://api.games.olmmcc.tk/new_game", (json) => {
        addMessages();
        startGame(json.id);
    });
}
function waitForGame(id) {
    document.getElementById("id").innerText = id;
    sendReq({ "id": window.localStorage.getItem("gamerId") }, "https://api.games.olmmcc.tk/get_status_of_game", (json) => {
        if (json.opponent_found) {
            clearInterval(dotdotdot);
            clearInterval(opponentWaiter);
            startGame(id);
        }
    });
}
function sendHumanSearchRequest() {
    sendReq({ "id": window.localStorage.getItem("gamerId") }, "https://api.games.olmmcc.tk/search_for_human_game", (json) => {
        if (json.success) {
            clearInterval(dotdotdot);
            startGame(json.id);
        } else {
            sendReq({ "id": window.localStorage.getItem("gamerId"), "type": "human" }, "https://api.games.olmmcc.tk/new_game", (json) => {
                waitForGame(json.id);
                opponentWaiter = setInterval(waitForGame, 1000, json.id);
            });
        }
    });
}
function checkId(startFn) {
    document.getElementById("newGameDiv").addEventListener("click", goToMainMenu);
    if (window.localStorage.getItem("gamerId") == null) {
        sendReq({}, "https://api.games.olmmcc.tk/new_id", (json) => {
            window.localStorage.setItem("gamerId", json.id);
            startFn();
        });
    } else {
        startFn();
    }
}
function rockButton() {
    makeMove(0);
}
function paperButton() {
    makeMove(1);
}
function scissorsButton() {
    makeMove(2);
}
document.addEventListener('keydown', keydown);
document.getElementById("rock").addEventListener("click", rockButton);
document.getElementById("paper").addEventListener("click", paperButton);
document.getElementById("scissors").addEventListener("click", scissorsButton);
changeOpacity(0.3);
newGameScreen();
