/*!
 *  CollaboKeys: a collaborative keyboard game
 *  Copyright (C) 2026  @tinkerer9 and @LethalShadowFlame
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const header = document.getElementsByClassName("header")[0];
const controls = document.getElementsByClassName("controls")[0];
const responses = document.getElementsByClassName("responses")[0];
const responsesList = document.getElementById("responsesList");

const clearResponsesCommand = document.getElementById("clearResponsesCommand");
const customCommandText = document.getElementById("customCommandText");
const customCommand = document.getElementById("customCommand");
const pressCommand = document.getElementById("pressCommand");
const pressCommandArg0 = document.getElementById("pressCommandArg0");
const uriCommand = document.getElementById("uriCommand");
const wrCommand = document.getElementById("wrCommand");
const wrCommandArg0 = document.getElementById("wrCommandArg0");
const wrCommandArg1 = document.getElementById("wrCommandArg1");
const wrCommandArg2 = document.getElementById("wrCommandArg2");
const lsCommand = document.getElementById("lsCommand");
const lsCommandArg0 = document.getElementById("lsCommandArg0");
const keyCommand = document.getElementById("keyCommand");
const keyCommandArg0 = document.getElementById("keyCommandArg0");
const keyCommandArg1 = document.getElementById("keyCommandArg1");
const keyCommandArg2 = document.getElementById("keyCommandArg2");
const kcCommand = document.getElementById("kcCommand");

/* COMMAND FUNCTIONS */

uriCommand.onclick = () => command("uri");
kcCommand.onclick = () => command("keycodes");

clearResponsesCommand.onclick = () => {
    responsesList.innerHTML = "";
}
customCommand.onclick = () => {
    command(customCommandText.value);
    customCommandText.value = "";
};
customCommandText.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        customCommand.click(); // simulate click on enter button
    }
});
pressCommand.onclick = () => {
    command("press", `'${pressCommandArg0.value}'`);
    pressCommandArg0.value = "";
};
pressCommandArg0.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        pressCommand.click(); // simulate click on enter button
    }
});
wrCommand.onclick = () => {
    command("waitingroom", wrCommandArg0.value, wrCommandArg1.value === "all" ? "all" : wrCommandArg2.value);
    wrCommandArg2.value = "";
};
wrCommandArg1.onchange = () => {
    wrCommandArg2.style.display = wrCommandArg1.value === "all" ? "none" : "block";
}
lsCommand.onclick = () => {
    command("list", lsCommandArg0.value);
}
keyCommand.onclick = () => {
    command("key", keyCommandArg0.value, keyCommandArg1.value === "all" ? "all" : keyCommandArg2.value);
    keyCommandArg2.value = "";
};
keyCommandArg1.onchange = () => {
    keyCommandArg2.style.display = keyCommandArg1.value === "all" ? "none" : "block";
}

/* END COMMAND FUNCTIONS */

function command(command, ...args) {
    const commandString = args.length === 0 ? command : command + " " + args.join(" ");

    const rootCommand = commandString.split(" ")[0];

    addResponse(rootCommand, handleCommand(commandString));
}

function addResponse(command, response) {
    command = escapeHTML(command);
    response = escapeHTML(response);
    responsesList.insertAdjacentHTML('afterbegin', `<li><b>${command}</b>:<br>${response}</li>`);
}

function escapeHTML(str) { // replace chars that mess up HTML syntax
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\n/g, "<br>"); // replace newlines
}