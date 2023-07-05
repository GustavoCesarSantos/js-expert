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
    this.view.configureRecordButton(this.onRecordPressed.bind(this));
    this.currentStream = await this.media.getCamera();
    this.socket = this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .build();
    this.currentPeer = await this.peerBuilder
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .setOnCallReceived(this.onPeerCallReceived())
      .setOnPeerStreamReceived(this.onPeerStreamReceived())
      .setOnCallError(this.onPeerCallError())
      .setOnCallClose(this.onPeerCallClose())
      .build();
    this.addVideoStream(this.currentPeer.id);
  }

  addVideoStream(userId, stream = this.currentStream) {
    const isCurrentId = false;
    this.view.renderVideo({
      userId,
      stream,
      isCurrentId,
    });
  }

  onUserConnected() {
    return (userId) => {
      console.info(`User connected: ${userId}`);
      this.currentPeer.call(userId, this.currentStream);
    };
  }

  onUserDisconnected() {
    return (userId) => {
      console.info(`User disconnected: ${userId}`);
      if (this.peers.has(userId)) {
        this.peers.get(userId).call.close();
        this.peers.delete(userId);
      }
      this.view.setParticipants(this.peers.size);
      this.view.removeVideoElement(userId);
    };
  }

  onPeerError() {
    return (error) => {
      console.error("error on peer", error);
    };
  }

  onPeerConnectionOpened() {
    return (peer) => {
      console.log("peer", peer);
      const id = peer.id;
      this.socket.emit("join-room", this.room, id);
    };
  }

  onPeerCallReceived() {
    return (call) => {
      call.answer(this.currentStream);
    };
  }

  onPeerStreamReceived() {
    return (call, stream) => {
      const callerId = call.peer;
      this.addVideoStream(callerId, stream);
      this.peers.set(callerId, { call });
      this.view.setParticipants(this.peers.size);
    };
  }

  onPeerCallError() {
    return (call, error) => {
      console.error("an call error ocurred!", error);
      this.view.removeVideoElement(call.peer);
    };
  }

  onPeerCallClose() {
    return (call) => {
      console.log("call closed!", call.peer);
    };
  }

  onRecordPressed(recordingEnabled) {
    this.recordingEnabled = recordingEnabled;
  }
}
