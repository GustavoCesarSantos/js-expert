console.log("I'm alive!")
postMessage("Ready")
postMessage({ eventType: "alive" })
onmessage = ({ data }) => {
    console.log("hey form worker", data)
    postMessage({ eventType: "progress" })
    postMessage({ eventType: "ocurrenceUpdate" })
}
