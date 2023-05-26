class VideoPlayer {
  constructor({ manifestJSON, network, videoComponent }) {
    this.manifestJSON = manifestJSON;
    this.network = network;
    this.videoComponent = videoComponent;
    this.videoElement = null;
    this.sourceBuffer = null;
    this.selected = {};
    this.videoDuration = 0;
    this.activeItem = {};
    this.selections = [];
  }

  initializeCodec() {
    this.videoElement = document.getElementById("vid");
    const mediaSourceSupported = !!window.MediaSource;
    if (!mediaSourceSupported) {
      alert("Seu browser ou sistema não suporta a MSE!");
      return;
    }
    const codecSupperted = MediaSource.isTypeSupported(this.manifestJSON.codec);
    if (!codecSupperted) {
      alert(
        `Seu browser ou sistema não suporta o code: ${this.manifestJSON.codec}`
      );
      return;
    }
    const mediaSource = new MediaSource();
    this.videoElement.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener(
      "sourceopen",
      this.sourceOpenWrapper(mediaSource)
    );
  }

  sourceOpenWrapper(mediaSource) {
    return async (_) => {
      this.sourceBuffer = mediaSource.addSourceBuffer(this.manifestJSON.codec);
      const selected = (this.selected = this.manifestJSON.intro);
      mediaSource.duration = this.videoDuration;
      await this.fileDownload(selected.url);
      setInterval(this.waitForQuestion.bind(this), 200);
    };
  }

  waitForQuestion() {
    const currentTime = parseInt(this.videoElement.currentTime);
    const option = this.selected.at === currentTime;
    if (!option) return;
    if (this.modalWasOpened()) return;
    this.videoComponent.configureModal(this.selected.options);
    this.activeItem = this.selected;
  }

  async currentFileResolution() {
    const LOWEST_RESOLUTION = 144;
    const prepareUrl = {
      url: this.manifestJSON.encerramento.url,
      fileResolution: LOWEST_RESOLUTION,
      fileResolutionTag: this.manifestJSON.fileResolutionTag,
      hostTag: this.manifestJSON.hostTag,
    };
    const url = this.network.parseManifestURL(prepareUrl);
    return this.network.getProperResolution(url);
  }

  async nextChunk(data) {
    const key = data.toLowerCase();
    const selected = this.manifestJSON[key];
    this.selected = {
      ...selected,
      at: parseInt(this.videoElement.currentTime + selected.at),
    };
    this.manageLag(this.selected);
    this.videoElement.play();
    await this.fileDownload(selected.url);
  }

  modalWasOpened() {
    return this.activeItem.url === this.selected.url;
  }

  manageLag(selected) {
    if (!!~this.selections.indexOf(selected.url)) {
      selected.at += 5;
      return;
    }
    this.selections.push(selected.url);
  }

  async fileDownload(url) {
    const fileResolution = await this.currentFileResolution();
    const prepareUrl = {
      url,
      fileResolution,
      fileResolutionTag: this.manifestJSON.fileResolutionTag,
      hostTag: this.manifestJSON.hostTag,
    };
    const finalUrl = this.network.parseManifestURL(prepareUrl);
    this.setVideoPlayerDuration(finalUrl);
    const data = await this.network.fetchFile(finalUrl);
    return this.processBufferSegments(data);
  }

  setVideoPlayerDuration(finalURL) {
    const bars = finalURL.split("/");
    const [name, videoDuration] = bars[bars.length - 1].split("-");
    this.videoDuration += parseFloat(videoDuration);
  }

  async processBufferSegments(allSegments) {
    const sourceBuffer = this.sourceBuffer;
    sourceBuffer.appendBuffer(allSegments);
    return new Promise((resolve, reject) => {
      const updateEnd = (_) => {
        sourceBuffer.removeEventListener("updateend", updateEnd);
        sourceBuffer.timestampOffset = this.videoDuration;
        return resolve();
      };
      sourceBuffer.addEventListener("updateend", updateEnd);
      sourceBuffer.addEventListener("error", reject);
    });
  }
}
