/*
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

let toLog = [];

function log(message) {
    toLog.push(message);
}

function getPlayerSelection(pid) {
    if (pid === -1) {
        return Object.values(players);
    }

    if (!Number.isFinite(pid)) {
        return [];
    }

    const player = players[pid];
    return player ? [player] : [];
}

const commands = {
    fallback() {
        log("Unrecognized command. Please try again.");
    },

    waitingroom(args) {
        const action = args[0];
        let pid = args[1];

        if (!action) {
            log("You need to provide more arguments (action)! Usage: waitingroom <admit/dismiss> <id>");
            return;
        }

        if (pid === "all") {
            pid = -1;
        } else if (pid === undefined || pid === "") {
            log("You need to provide more arguments (id)! Usage: waitingroom <admit/dismiss> <id>");
            return;
        } else {
            pid = Number(pid);
        }

        const playersToUpdate = getPlayerSelection(pid);
        if (!playersToUpdate.length) {
            log("Invalid player, did you mistype the id?");
            return;
        }

        switch (action) {
            case "admit":
            case "a":
                playersToUpdate.forEach((player) => {
                    player.admit();
                    log(`Admitted ${player.name} (#${player.id}).`);
                });
                break;
            case "dismiss":
            case "d":
                playersToUpdate.forEach((player) => {
                    player.dismiss();
                    log(`Dismissed ${player.name} (#${player.id}).`);
                });
                break;
            default:
                log("Invalid method, did you misspell the first argument?");
        }
    },

    list(args) {
        let filterBy = (args[0] || "all").toLowerCase();
        if (filterBy === "waitingroom") {
            filterBy = "wr";
        }

        const showWait = filterBy !== "wr";
        const validFilters = new Set(["all", "wr", "active", "nameless"]);

        if (!validFilters.has(filterBy)) {
            log("Invalid list filter. Use all, active, waitingroom, or nameless.");
            return;
        }

        const output = Object.values(players).filter((player) => {
            if (!player) {
                return false;
            }

            switch (filterBy) {
                case "all":
                    return true;
                case "wr":
                    return player.inWaitingRoom();
                case "active":
                    return !player.inWaitingRoom() && !player.noNameSet();
                case "nameless":
                    return player.noNameSet();
                default:
                    return false;
            }
        });

        if (!output.length) {
            log("No players matched that filter.");
            return;
        }

        output.forEach((player, index) => {
            log(`${player.name} (#${player.id}):`);
            log(player.ip);
            log(`Assigned Keys: ${getReservedKeysString(player.id)}`);
            if (showWait && player.waitingRoom) {
                log("In waiting room");
            }
            if (index !== output.length - 1) {
                log("---");
            }
        });
    },

    key(args) {
        const action = args[0];
        const key = args[1];

        if (!action) {
            log("You need to provide more arguments (action)! Usage: key <assign/revoke/enable/disable> <name/all>");
            return;
        }

        if (key !== "all" && (!key || !keyExists(key))) {
            log("Invalid key, did you mistype the key name?");
            return;
        }

        switch (action) {
            case "assign":
            case "a":
                actionCallback(key, () => {}, "You don't want to do that.", () => {}, `Ask the player to press the key once. If it's reserved, use \"key revoke ${key}\"`);
                break;
            case "revoke":
            case "r":
                actionCallback(key, revokeAllKeys, "Reset all keys.", revokeKey, `${key} revoked from all players.`);
                break;
            case "enable":
            case "e":
                actionCallback(key, enableAllKeys, "All keys enabled.", enableKey, `${key} enabled.`);
                break;
            case "disable":
            case "d":
                actionCallback(key, disableAllKeys, "All keys disabled.", disableKey, `${key} disabled.`);
                break;
            default:
                log("Invalid method, did you misspell the first argument?");
        }
    },

    uri() {
        log("192.168.1.0");
    },

    keycodes() {
        log("Opening keycodes list in a new tab...");

        const blob = new Blob([makeKeycodesTable()], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    },

    press(args) {
        const key = args[0];
        const type = args[1];

        if (!key) {
            log("You need to provide more arguments (key)! Usage: press <key>");
            return;
        }

        if (!keyExists(key)) {
            log(`'${key}' is not supported.`);
            return;
        }

        const keyName = getKeyName(key);
        const typed = type === "down" ? "pushed" : type === "up" ? "released" : "pressed";
        log(key === keyName ? `'${key}' ${typed}.` : `'${key}' (${keyName}) ${typed}.`);
    }
};

function actionCallback(key, oneF, oneM, twoF, twoM) {
    if (key === "all") {
        oneF();
        log(oneM);
    } else {
        twoF(key);
        log(twoM);
    }
}

function commandCallbacks(cmd) {
    switch (cmd) {
        case "waitingroom":
        case "wr":
            return commands.waitingroom;
        case "list":
        case "ls":
            return commands.list;
        case "key":
        case "k":
            return commands.key;
        case "uri":
        case "ip":
            return commands.uri;
        case "keycodes":
        case "kc":
            return commands.keycodes;
        case "press":
        case "type":
            return commands.press;
        default:
            return commands.fallback;
    }
}

function handleCommand(input) {
    toLog = [];

    const words = [...input.matchAll(/'([^']*)'|"([^"]*)"|(\S+)/g)].map((match) => match[1] ?? match[2] ?? match[3]);
    if (!words.length) {
        return "";
    }

    const commandFn = commandCallbacks(words[0]);
    commandFn(words.slice(1));
    return toLog.join("\n");
}
