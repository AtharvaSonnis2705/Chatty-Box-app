import { useEffect, useState, useRef } from 'react';

export function ChatCard() {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080");

    ws.onmessage = (event) => {
      //@ts-ignore
      setMessages(m => [...m, event.data]);
    };
    //@ts-ignore
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }));
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-4">
        {/* Header with Chattybox name */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">Chattybox</h1>
        </div>
        <div className="w-full p-4 bg-white shadow-lg rounded-2xl h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-2 p-2">
            {messages.map((msg, index) => (
              <div key={index} className="p-2 bg-blue-100 rounded-lg w-fit">
                {msg}
              </div>
            ))}
          </div>
        </div>
        <div className="flex mt-2">
          <input
            ref={inputRef}
            type="text"
            id="message"
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={() => {
            //@ts-ignore
            const newMessage = inputRef.current?.value;

            //@ts-ignore
            wsRef.current.send(JSON.stringify({
              type: "chat",
              payload: {
                message: newMessage
              }
            }));
            inputRef.current.value = ''; // 
          }} className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}