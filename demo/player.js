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

const players = {};

function getPlayerCount() {
    return Object.keys(players).length;
}

function addPlayer(pid, player) {
    players[pid] = player;
}

function isPlayer(pid) {
    return pid in players;
}

function getAllPlayers() {
    return Object.values(players);
}

class Player {
    constructor(name, wr) {
        this.name = name;
        this.id = maxPlayerId++;
        this.ip = `192.168.1.${this.id + 1}`;
        this.waitingRoom = wr;
        addPlayer(this.id, this);
    }

    setName(name) {
        this.name = name;
    }

    noNameSet() {
        return this.name === null || this.name === "";
    }

    inWaitingRoom() {
        return this.waitingRoom;
    }

    admit() {
        this.waitingRoom = false;
    }

    dismiss() {
        this.waitingRoom = true;
    }

    canType() {
        return !this.noNameSet() && !this.waitingRoom;
    }
}

new Player("Andrew", false);
new Player("Billy", false);
new Player("Charlie", true);
new Player("Drew", false);
new Player("Emma", true);