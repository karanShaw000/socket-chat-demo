import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
const socket: Socket = io("http://localhost:8080/");

function App() {
  const [input, setInput] = useState<string>("");
  const [id, setId] = useState<string | undefined>("");
  const [messageLog, setMessageLog] = useState<
    Array<{ message: string; id: string }>
  >([]);
  const [roomMessageLog, setRoomMessageLog] = useState<
    Array<{ message: string; id: string }>
  >([]);

  const [room, setRoom] = useState<string>("");

  const sendMessageHandler = () => {
    socket.emit("send_meassage", { message: input, room });
    setInput("");
  };

  const joinRoomHandler = () => {
    if (room !== "") socket.emit("join_room", room);
  };
  const joinGlobalRoomHandler = () => {
    socket.emit("join_room", "");
    setRoom("");
  };
  useEffect(() => {
    socket.on("connect", () => {
      setId(socket.id);
    });
    socket.on(
      "receive_message",
      ({ res, id, room }: { res: string; id: string; room: string }) => {
        if (room === "") setMessageLog((old) => [...old, { message: res, id }]);
        else setRoomMessageLog((old) => [...old, { message: res, id }]);
      }
    );
  }, []);
  return (
    <>
      <p>
        Global Message is like all message where every user can see the message
      </p>
      <h1>My Id: {id}</h1>
      <div>
        <button onClick={() => joinGlobalRoomHandler}>Global</button>
      </div>
      <br />
      <div>
        <input type="number" onChange={(e) => setRoom(e.target.value)} />
        <button onClick={joinRoomHandler}>Join Room</button>
      </div>
      <br />
      <input
        type="text"
        value={input}
        placeholder="Message.."
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessageHandler}>Send Message</button>

      <h1>Global Messages:</h1>
      <div>
        {messageLog.map((message, index) => (
          <p key={index}>
            {message.message} by {message.id}
          </p>
        ))}
      </div>

      {room !== "" && (
        <div>
          <h1>Room Messages</h1>
          <h2>Room Id: ${room}</h2>

          {roomMessageLog.map((message, index) => (
            <p key={index}>
              {message.message} by {message.id}
            </p>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
