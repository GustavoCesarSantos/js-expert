class View {
  constructor() {
    this.recorderBtn = document.getElementById("record");
    this.leaveBtn = document.getElementById("leave")
  }

  createVideoElement({ muted = true, src, srcObject }) {
    const video = document.createElement("video");
    video.muted = muted;
    video.src = src;
    video.srcObject = srcObject;
    if (src) {
      video.controls = true;
      video.loop = true;
      Util.sleep(200).then((_) => video.play());
    }
    if (srcObject) {
      video.addEventListener("loadedmetadata", (_) => video.play());
    }
    return video;
  }

  renderVideo({
    userId,
    stream = null,
    url = null,
    isCurrentId = false,
  }) {
    const video = this.createVideoElement({
      src: url,
      srcObject: stream,
      muted: isCurrentId,
    });
    this.appendToHtmlTree(userId, video, isCurrentId);
  }

  appendToHtmlTree(userId, video, isCurrentId) {
    const div = document.createElement("div");
    div.id = userId;
    div.classList.add("wrapper");
    div.append(video);
    const div2 = document.createElement("div");
    div2.innerText = isCurrentId ? "" : userId;
    div.append(div2);
    const videoGrid = document.getElementById("video-grid");
    videoGrid.append(div);
  }

  setParticipants(count) {
    const myself = 1;
    const participants = document.getElementById("participants");
    participants.innerHTML = count + myself;
  }

  removeVideoElement(id) {
    const element = document.getElementById(id);
    element.remove();
  }

  toogleRecordingButtonColor(isActive = true) {
    this.recorderBtn.style.color = isActive ? "red" : "white";
  }

  onRecordClick(command) {
    this.recordingEnabled = false;
    return () => {
      const isActive = (this.recordingEnabled = !this.recordingEnabled);
      command(this.recordingEnabled);
      this.toogleRecordingButtonColor(isActive);
    };
  }

  onLeaveClick(command) {
    return async () => {
      command()
      await Util.sleep(3000)
      window.location = "/pages/home"
    }
  }

  configureRecordButton(command) {
    this.recorderBtn.addEventListener("click", this.onRecordClick(command));
  }

  configureLeaveButton(command) {
    this.leaveBtn.addEventListener("click", this.onLeaveClick(command));
  }
}
