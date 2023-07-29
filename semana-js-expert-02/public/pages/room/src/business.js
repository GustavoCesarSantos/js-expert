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
    this.usersRecording = new Map();
  }

  static initialize(deps) {
    const instance = new Business(deps);
    return instance._init();
  }

  async _init() {
    this.view.configureRecordButton(this.onRecordPressed.bind(this));
    this.view.configureLeaveButton(this.onLeavePressed.bind(this));
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
    const recorderInstance = new Recorder(userId, stream);
    this.usersRecording.set(recorderInstance.fileName, recorderInstance);
    if (this.recordingEnabled) {
      recorderInstance.startRecording();
    }
    const isCurrentId = userId === this.currentStream.id;
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
      this.stopRecording(userId);
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
      if(this.peers.has(callerId)) {
        console.log("calling twice, ignoring second call...", callerId);
        return;
      }
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
    console.log("pressionou: ", recordingEnabled);
    for (const [key, value] of this.usersRecording) {
      if (this.recordingEnabled) {
        value.startRecording();
        continue;
      }
      this.stopRecording(key);
    }
  }

  onLeavePressed() {
    this.usersRecording.forEach((value, key) => {
      value.download()
    })
  }

  async stopRecording(userId) {
    const usersRecording = this.usersRecording;
    for (const [key, value] of usersRecording) {
      const isContextUser = key.includes(userId);
      if (!isContextUser) continue;
      const rec = value;
      const isRecordingActive = rec.isRecordingActive;
      if (!isRecordingActive) continue;
      await rec.stopRecording();
      this.playRecording(key);
    }
  }

  playRecording(userId) {
    const user = this.usersRecording.get(userId);
    const videosURLs = user.getAllVideoURLs();
    videosURLs.map(url => {
      this.view.renderVideo({ url, userId })
    });
  }
}
