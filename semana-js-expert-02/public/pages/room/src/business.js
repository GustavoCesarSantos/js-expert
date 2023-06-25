class Business {
  constructor({ room, media, view, socketBuilder, peerBuilder }) {
    this.room = room;
    this.media = media;
    this.view = view;
    this.peerBuilder = peerBuilder;
    this.currentPeer = {};
    this.socketBuilder = socketBuilder;
    this.socket = {};
    this.currentStream = {};
    this.peers = new Map();
  }

  static initialize(deps) {
    const instance = new Business(deps);
    return instance._init();
  }

  async _init() {
    this.socket = this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .build();
    this.currentStream = await this.media.getCamera();
    this.addVideoStream("teste01");
    this.currentPeer = await this.peerBuilder
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .setOnCallReceived(this.onPeerCallReceived())
      .setOnPeerStreamReceived(this.onPeerStreamReceived())
      .build();
  }

  addVideoStream(userId, stream = this.currentStream) {
    const isCurrentId = false;
    this.view.renderVideo({
      userId,
      stream,
      isCurrentId,
    });
  }

  onUserConnected = function () {
    return (userId) => {
      console.info(`User connected: ${userId}`);
      this.currentPeer.call(userId, this.currentStream);
    };
  };

  onUserDisconnected = function () {
    return (userId) => {
      console.info(`User disconnected: ${userId}`);
    };
  };

  onPeerError = function () {
    return (error) => {
      console.error("error on peer", error);
    };
  };

  onPeerConnectionOpened = function () {
    return (peer) => {
      console.log("peer", peer);
      const id = peer.id;
      this.socket.emit("join-room", this.room, id);
    };
  };

  onPeerCallReceived = function () {
    return (call) => {
      call.answer(this.currentStream);
    };
  };

  onPeerStreamReceived = function () {
    return (call, stream) => {
      const callerId = call.peer;
      this.addVideoStream(callerId, stream);
      this.peers.set(callerId, { call });
      this.view.setParticipants(this.peers.size);
    };
  };
}
