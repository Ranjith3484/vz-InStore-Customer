var customerViewCustomerVideo = document.querySelector(
  "#selfStreamVideoElement"
);
var customerViewClientVideo = document.querySelector(
  "#remoteStreamVideoElement"
);


//start video chat
function goToVideoChat() {
  //webrtc starts here
  "use strict";

  const MESSAGE_TYPE = {
    SDP: "SDP",
    CANDIDATE: "CANDIDATE",
  };

  let code = 987654321;
  let peerConnection;
  let signaling;
  const senders = [];
  let userMediaStream;

  const startChat = async () => {
    try {
      userMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

        signaling = new WebSocket("wss://videochat-app-bj.herokuapp.com");
      //  signaling = new WebSocket("wss://tricky-dragonfly-29.loca.lt");
      setTimeout(function () {
        peerConnection = createPeerConnection();

        addMessageHandler();

        userMediaStream
          .getTracks()
          .forEach((track) =>
            senders.push(peerConnection.addTrack(track, userMediaStream))
          );
        document.getElementById(
          "selfStreamVideoElement"
        ).srcObject = userMediaStream;
      }, 10000);
    } catch (err) {
      console.error(err);
    }
  };

  startChat();

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onnegotiationneeded = async () => {
      await createAndSendOffer();
    };

    pc.onicecandidate = (iceEvent) => {
      if (iceEvent && iceEvent.candidate) {
        sendMessage({
          message_type: MESSAGE_TYPE.CANDIDATE,
          content: iceEvent.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const video = document.getElementById("remoteStreamVideoElement");
      video.srcObject = event.streams[0];
      console.log("live streaming");
    };

    pc.onconnectionstatechange = function (event) {
      switch (pc.connectionState) {
        case "connected":
          console.log("connection established");
          //change status text
          document.getElementById("connectionStatus").innerHTML = "You are connected to a Verizon store rep";
          //hide status text
          setTimeout(function(){
            document.getElementById("connectionStatus").style.display = 'none'
          },10000)
          break;
        case "disconnected":
        case "failed":
          console.log("connection failed");
         endVideoCall();
          break;
        case "closed":
          console.log("connection ended");
         endVideoCall();
          break;
      }
    };

    return pc;
  };

  const addMessageHandler = () => {
    signaling.onmessage = async (message) => {
      const data = JSON.parse(message.data);

      if (!data) {
        return;
      }

      const { message_type, content } = data;
      try {
        if (message_type === MESSAGE_TYPE.CANDIDATE && content) {
          await peerConnection.addIceCandidate(content);
        } else if (message_type === MESSAGE_TYPE.SDP) {
          if (content.type === "offer") {
            await peerConnection.setRemoteDescription(content);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            sendMessage({
              message_type: MESSAGE_TYPE.SDP,
              content: answer,
            });
          } else if (content.type === "answer") {
            await peerConnection.setRemoteDescription(content);
          } else {
            console.log("Unsupported SDP type.");
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
  };

  const sendMessage = (message) => {
    signaling.send(
      JSON.stringify({
        ...message,
        code,
      })
    );
  };

  const createAndSendOffer = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    sendMessage({
      message_type: MESSAGE_TYPE.SDP,
      content: offer,
    });
  };

  //webrtc ends here
}

goToVideoChat();

// audio change
function audioChange() {
  const customerMediaStream = customerViewCustomerVideo.srcObject;
  const customerMediaTracks = customerMediaStream.getTracks();

  if (
    document.getElementById("myMic").classList.contains("customerViewActive")
  ) {
    //chnage icons
    document.getElementById("myMic").classList.add("customerViewInactive");
    document.getElementById("myMic").classList.add("crossLine");
    document.getElementById("myMic").classList.remove("customerViewActive");
   
    //remove audio track
    customerMediaTracks.forEach(function (device) {
      if (device.kind === "audio") {
        device.enabled = false;
        device.muted = true;
      }
    });
  } else {
    //chnage icons
    document.getElementById("myMic").classList.add("customerViewActive");
    document.getElementById("myMic").classList.remove("customerViewInactive");
    document.getElementById("myMic").classList.remove("crossLine");
  
    //add audio track
    customerMediaTracks.forEach(function (device) {
      if (device.kind === "audio") {
        device.enabled = true;
        device.muted = false;
      }
    });
  }
}

//video change
function videoChange() {
  const customerMediaStream = customerViewCustomerVideo.srcObject;
  const customerMediaTracks = customerMediaStream.getTracks();
  
  if (
    document.getElementById("myVideo").classList.contains("customerViewActive")
  ) {
    //change icons and replace video with image 
    document.getElementById("myVideo").classList.add("customerViewInactive");
    document.getElementById("myVideo").classList.add("crossLine");
    document.getElementById("myVideo").classList.remove("customerViewActive");
    document.getElementById("selfStreamVideoElement").style.display =
      "none";
    document.getElementById("imageElement").style.display = "";
    document.getElementById("imageElement").classList.remove("hideElement");

    //stop video track
    customerMediaTracks.forEach(function (device) {
      if (device.kind === "video") {
        device.enabled = false;
        device.muted = true;
      }
    });
  } else {
     //change icons and replace image with video
    document.getElementById("myVideo").classList.add("customerViewActive");
    document.getElementById("myVideo").classList.remove("customerViewInactive");
    document.getElementById("myVideo").classList.remove("crossLine");
    document.getElementById("selfStreamVideoElement").style.display =
      "";
    document.getElementById("imageElement").style.display = "none";

    //add video track
    customerMediaTracks.forEach(function (device) {
      if (device.kind === "video") {
        device.enabled = true;
        device.muted = false;
      }
    });
  }

}

//end call
function endVideoCall(){
  window.location.replace('./index.html')
}

document.getElementById("selfStreamerName").innerHTML = "Jack";
