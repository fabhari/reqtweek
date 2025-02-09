import React, { useState } from "react";
import "./index.css"; // Import the CSS file

// {
//   "computer" : "900"
//   }

const ReqTweek = () => {
  const [url, setUrl] = useState("");
  // const [header, setHeader] = useState("");
  const [json, setJson] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [sessions, setSessions] = useState([]);

  React.useEffect(() => {
    chrome.storage.local.get(null, (items) => {
      const allSessions = Object.values(items);
      setSessions(allSessions);
      console.log("Loaded sessions from local storage:", allSessions);
    });
  }, []);


  const generateId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  function sendMessageToBackground(data) {
    console.log("data about send to background is", data);

    chrome.runtime.sendMessage(data, (response) => {
      console.log("Response from background:", response);
    });
  }

  const handleSave = () => {
    try {
      console.log("json",json);
      JSON.parse(json);
    } catch (e) {
      alert("Invalid JSON format. Please enter a valid JSON string.");
      return false;
    }

    if (!url || !json || !sessionName) {
      alert("Please fill in all fields before saving.");
    } else {
      const id = generateId();
      console.log("Saved:", { url, json, sessionName, id });
      const data = { url, json, name: sessionName, id };
     setSessions([...sessions, data]);

      chrome.storage.local.set({ [data.id]: data }, () => {
        console.log("Data stored in local storage with ID:", data.id);
      });
   
    }
  };

  const handleCloseSession = (id)=> {
    setSessions(sessions.filter(session => session.id !== id));
    chrome.storage.local.remove(id, () => {
      console.log("Session removed from local storage with ID:", id);
    });
  }


  const handleViewAllSession = () =>{
    chrome.storage.local.get(null, (items) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving data:', chrome.runtime.lastError);
        return;
      }
      
      const allKeys = Object.keys(items);
      console.log('All keys in local storage:', allKeys);
    });
  }

  const handleOpenSession = (id)=> {
    console.log("Trying to open ", id)
    chrome.storage.local.get(id, (result) => {
      const storedData = result[id];
      sendMessageToBackground(storedData)
   
    });
  }

  const handleClear = () => {
    setUrl("");
    setSessionName("");
    setJson("");
  };

  return (
    <div className="container">
      <div className="input-group">
        <label className="label">Url :</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter the URL"
          className="input"
        />
      </div>
      {/* <div className="input-group">
        <label className="label">Header:</label>
        <input
          type="text"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          placeholder="Enter Header"
          className="input"
        />
      </div> */}
      <div className="input-group">
        <label className="label">Enter Custom Header :</label>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder="Enter Header as JSON"
          className="input textarea"
        />
      </div>
      <div className="input-group">
        <label className="label">Session Name:</label>
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="input"
        />
      </div>
      <div className="button-group">
        <button onClick={handleSave} className="save-btn">
          Save
        </button>
        <button onClick={handleClear} className="clear-btn">
          Clear
        </button>
      </div>
    
      {sessions.length > 0 && (
        <div className="sessions">
          <h3 className="sessions-title">Sessions</h3>
          <button onClick={handleViewAllSession} className="view-all-btn">
            View All session
          </button>
          <ul className="session-list">
            {sessions.map((session, index) => {
              return (
                <div key={`${index}-${session?.id}`} className="session" >
                  <li className="session-item" onClick={()=>handleOpenSession(session?.id)}>
                    {session?.name}   
                  </li>
                  <button onClick={()=>handleCloseSession(session?.id)}> ❌ </button> 
                </div>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReqTweek;