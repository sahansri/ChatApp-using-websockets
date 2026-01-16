import { useEffect, useState } from 'react'

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [usermessage, setUsermessage] = useState<string>("");
  
  //connnect tho the websocket server
  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:4000");
    ws.onopen = ()=>{
      console.log("connected to the server");
      setSocket(ws);
    };

    ws.onmessage = (event)=>{
      console.log("recieved message fronm the server");
      if(event.data instanceof Blob){
        const reader = new FileReader();
        reader.onload = ()=>{
          const text = reader.result as string;
          setMessages((prevMessage)=>[...prevMessage, text]);
        }
        reader.readAsText(event.data);
      }else if(typeof event.data === "string"){
        setMessages((prevMessage)=>[...prevMessage,event.data])
      }
    };

    ws.onclose =()=>{
      console.log("disconnnect from the server");
      setSocket(null);
    }

    ws.onerror = (error)=>{
      console.log(error);
      ws.close();
    }

    return ()=>{
      ws.close();
    }

  },[]);

  if(!socket){
    return(
      <div>
        <p>Connecting to WebSocket server....</p>
      </div>
    );
  }
  return (
    <div>
      <h1>WebSocket Chat</h1>
      <div style={{border:"1px solid black", height:"300px", width:"400px", overflowY:"scroll", padding:"10px"}}>
        {messages.map((msg, index)=>(
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input 
        type="text" 
        value={usermessage} 
        onChange={(e)=>setUsermessage(e.target.value)} 
        placeholder="Type your message..."
      />
      <button
        onClick={()=>{
          if(usermessage.trim() !== ""){
            socket.send(usermessage);
            setUsermessage("");
          }
        }}
      >
        Send
      </button>
    </div>
  );
}

export default App
