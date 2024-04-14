import Attendee from "../entities/attendee.js";
import { constants } from "../util/constants.js";

export default class RoomsController {
  #users = new Map();

  constructor() {}

  onNewConnection(socket) {
    const { id } = socket;
    console.log("connection stablish with ", id);
    this.#updateGlobalUserData(id);
  }

  joinRoom(socket, { user, room }) {
    const userId = (user.id = socket.d));
    const roomId = room.id;
    this.#updateGlobalUserData(userId, user, roomId);
    socket.emit(constants.event.USER_CONNECTED, data);
  }

  #joinUserRoom(socket, user, room) {

  }

  #updateGlobalUserData(userId, userData = {}, roomId = "") {
    const user = this.#users.get(userId) ?? {};
    const existingRoom = this.rooms.has(roomId);
    const updatedUserData = new Attendee({
      ...user,
      ...userData,
      roomId,
      isSpeaker: !existingRoom
    });
    this.#users.set(userId, updatedUserData)
    return this.#users.get(userId)
  }

  getEvents() {
    const functions = Reflect.ownKeys(RoomsController.prototype)
      .filter((fn) => fn !== "constructor")
      .map((name) => [name, this[name].bind(this)]);

    return new Map(functions);
  }
}
