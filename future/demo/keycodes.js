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

const keycodes = {
    // "keyName": [keyCode, "humanName", enabled, assignedPlayer],

    "a": [0, "a", true, 1],
    "b": [11, "b", true, null],
    "c": [8, "c", true, null],
    "d": [2, "d", true, 3],
    "e": [14, "e", true, null],
    "f": [3, "f", true, null],
    "g": [5, "g", true, null],
    "h": [4, "h", true, null],
    "i": [34, "i", true, null],
    "j": [38, "j", true, null],
    "k": [40, "k", true, null],
    "l": [37, "l", true, null],
    "m": [46, "m", true, null],
    "n": [45, "n", true, null],
    "o": [31, "o", true, null],
    "p": [35, "p", true, null],
    "q": [12, "q", true, null],
    "r": [15, "r", true, null],
    "s": [1, "s", true, 2],
    "t": [17, "t", true, null],
    "u": [32, "u", true, null],
    "v": [9, "v", true, null],
    "w": [13, "w", true, 0],
    "x": [7, "x", true, null],
    "y": [16, "y", true, null],
    "z": [6, "z", true, null],

    "0": [29, "0", true, null],
    "1": [18, "1", true, null],
    "2": [19, "2", true, null],
    "3": [20, "3", true, null],
    "4": [21, "4", true, null],
    "5": [23, "5", true, null],
    "6": [22, "6", true, null],
    "7": [26, "7", true, null],
    "8": [28, "8", true, null],
    "9": [25, "9", true, null],

    " ": [49, "space", true, 4],

    "ArrowLeft": [123, "left arrow", true, 1],
    "ArrowRight": [124, "right arrow", true, 3],
    "ArrowDown": [125, "down arrow", true, 2],
    "ArrowUp": [126, "up arrow", true, 0]
}

function makeKeycodesTable() {
    try {
        const headers = [
            "Key",
            "Enabled",
            "Player ID"
        ];

        const rows = Object.entries(keycodes).map(formatRow);

        const widths = headers.map((header, colIndex) => {
            return Math.max(
                header.length,
                ...rows.map(row => row[colIndex].length)
            );
        });

        const topBorder    = "┌" + widths.map(w => "─".repeat(w + 2)).join("┬") + "┐";
        const middleBorder = "├" + widths.map(w => "─".repeat(w + 2)).join("┼") + "┤";
        const bottomBorder = "└" + widths.map(w => "─".repeat(w + 2)).join("┴") + "┘";

        const headerRow =
            "│ " +
            headers.map((h, i) => center(h, widths[i])).join(" │ ") +
            " │";

        const bodyRows = rows.map(row =>
            "│ " +
            row.map((cell, i) => center(cell, widths[i])).join(" │ ") +
            " │"
        );

        return [
            topBorder,
            headerRow,
            middleBorder,
            ...bodyRows,
            bottomBorder
        ].join("\n");
    } catch (err) {
        return "Unable to create keycodes table.";
    }
}

function formatRow([keyName, [keyCode, humanName, enabled, assignedPlayer]]) {
    return [
        `'${keyName}'` + (keyName === humanName ? "" : ` (${humanName})`),
        enabled ? "yes" : "no",
        assignedPlayer === null ? "-" : `${players[assignedPlayer].name} (#${assignedPlayer})`
    ];
}

function center(str, width) {
    const totalPadding = width - str.length;
    const left = Math.floor(totalPadding / 2);
    const right = totalPadding - left;
    return " ".repeat(left) + str + " ".repeat(right);
}

function assignKey(key, id) {
    keycodes[key][3] = id;
}
function isAssignedKey(key, id) {
    return keycodes[key][3] === id;
}
function revokeKey(key) {
    assignKey(key, null);
}
function revokeAllKeys() {
    Object.keys(keycodes).forEach(key => {
        revokeKey(key);
    });
}
function getReservedKeys(id) {
    return Object.keys(keycodes).filter(key => {
        return isAssignedKey(key, id);
    });
}
function getReservedKeysString(id) { // above but formatted for console
    const keys = [];

    getReservedKeys(id).forEach((key) => {
        const humanName = keycodes[key][1];
        keys.push(key === humanName ? `'${key}'` : `(${humanName})`);
    });

    return keys.join(", ");
}

function keyExists(key) {
    return key in keycodes;
}

function keyEnabled(key) {
    return keycodes[key][2];
}

function enableKey(key) {
    keycodes[key][2] = true;
}
function disableKey(key) {
    keycodes[key][2] = false;
}
function enableAllKeys() {
    Object.keys(keycodes).forEach(key => {
        enableKey(key);
    });
}
function disableAllKeys() {
    Object.keys(keycodes).forEach(key => {
        disableKey(key);
    });
}

function getKeyName(key) {
    return keycodes[key][1];
}