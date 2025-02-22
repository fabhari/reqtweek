import React, { useState } from "react";
import "./index.css"; // Import the CSS file
import TrieSearch from "./trie";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactSearchBox from "react-search-box";

// {
//   "computer" : "900"
//   }

const ReqTweek = () => {
  const [url, setUrl] = useState("");
  const [json, setJson] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [sessions, setSessions] = useState([]);
  const [alert_, setAlert] = useState(false);
  

  const test_data = [
   {
      id: "0gRM4",
      name: "Eustonscreen2",
      url: "https://prod.env.railpoint.org/screen/welcomescreen",
      header: { "Computer-name": "RP100601" },
    },
   {
      id: "MqZQc",
      name: "PaddingtonScreen1",
      url: "https://prod.env.railpoint.org/screen/welcomescreen",
      header: { "Computer-name": "RP100602" },
    },
  ];

  React.useEffect(() => {
    chrome.storage.local.get(null, (items) => {
      const allSessions = Object.values(items);
      setSessions(allSessions);
      //console.log("Loaded sessions from local storage:", allSessions);
    });
  }, []);


  const updateSessionData = (id, newJsonData) => {
    try {
      const parsedData = JSON.parse(newJsonData);
      chrome.storage.local.get(id, (item) => {
        if (item[id]) {
          const updatedData = { ...item[id], header: parsedData };
          chrome.storage.local.set({ [id]: updatedData }, () => {
            //console.log("Session data updated in local storage with ID:", id);
            setSessions(sessions.map(session => session.id === id ? updatedData : session));
          });
        } else {
          //console.log("No session found with ID:", id);
        }
      });
    } catch (e) {
      alert("Invalid JSON format. Please enter a valid JSON string.");
    }
  };

  const generateId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  function sendMessageToBackground(data) {
    //console.log("data about send to background is", data);

    chrome.runtime.sendMessage(data, (response) => {
      //console.log("Response from background:", response);
      if(response.success){
        //console.log("sent data ", data)
      }
    });
  }

  const handleSave = () => {
    try {
      //console.log("json",json);
      JSON.parse(json);
      
    } catch (e) {
      alert("Invalid JSON format. Please enter a valid JSON string.");
      return false;
    }

    if (!url || !json || !sessionName) {
      alert("Please fill in all fields before saving.");
    } else {
      const id = generateId();
      const data = { url, header : JSON.parse(json),name : sessionName, id }
      //console.log("Saved:", data);
     setSessions([...sessions, data]);

      chrome.storage.local.set({ [data.id]: data }, () => {
        //console.log("Data stored in local storage with ID:", data.id);
      });
   
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 2000);

    }
  };

  const handleCloseSession = (id)=> {
    setSessions(sessions.filter(session => session.id !== id));
    chrome.storage.local.remove(id, () => {
      //console.log("Session removed from local storage with ID:", id);
    });
  }


  const handleViewAllSession = () => {
    chrome.storage.local.get(null, (items) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving data:', chrome.runtime.lastError);
        return;
      }
      
      const allKeys = Object.keys(items);
      allKeys.forEach((key) => {
        chrome.storage.local.get(key, (result) => {
          if (chrome.runtime.lastError) {
            console.error(`Error retrieving data for ${key}:`, chrome.runtime.lastError);
          } else {
            const storedData = result[key];
            sendMessageToBackground(storedData)          
          }
        });
      });
    });
  }

  const handleOpenSession = (id)=> {
    //console.log("Trying to open ", id)
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
     { alert_ &&
        <div className="alert_cus">
          Session Saved
      </div>
      }
    <Tabs
      defaultActiveKey="home"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="home" title="Home">
      <div className="wrapper">
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
    </div>
      </Tab>
      <Tab eventKey="Sessions" title="Sessions">
      <TrieSearch data={sessions} closeCallback={handleCloseSession} openCallback={handleOpenSession}/>
       {/* {sessions.length > 0 ? 
        <div className="sessions">
            <ul>
              {sessions.map((session, index) => {
                return (
                  <div key={`${index}-${session?.id}`} className="session" >
                    <li className="session-item" onClick={()=>handleOpenSession(session?.id)}>
                      {session?.name}   
                    </li>
                    <button className="close-btn" onClick={()=>handleCloseSession(session?.id)}> ❌ </button> 
                  </div>
                );
              })}
            </ul>
        </div> :  <div> No sessions found</div> } */}
      </Tab>
    </Tabs>

    
    </div>
  );
};

export default ReqTweek;