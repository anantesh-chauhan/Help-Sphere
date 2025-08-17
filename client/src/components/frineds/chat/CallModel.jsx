import React, { useEffect, useRef } from "react";

export default function CallModal({ call, socket, user }) {
  const myVideo = useRef();
  const userVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      myVideo.current.srcObject = stream;
      myVideo.current.play();
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h3 className="font-semibold">Incoming Call</h3>
        <video ref={myVideo} muted className="w-40 h-40 bg-black" />
        <video ref={userVideo} className="w-40 h-40 bg-black" />

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => socket.emit("answerCall", { to: call.from, signal: "accept" })}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Accept
          </button>
          <button
            onClick={() => socket.emit("endCall", { to: call.from })}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
