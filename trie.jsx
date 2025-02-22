import { useState, useEffect, useRef } from "react";

// Trie Node
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.data = null; // Store full object reference
  }
}

// Trie Class
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  clear() {
    this.root = new TrieNode();
  }
  // Insert name & store reference to full object
  insert(name, obj) {
    let node = this.root;
    for (let char of name.toLowerCase()) { // Case-insensitive
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.data = obj; // Store full object
  }

  // Search names based on prefix
  searchPrefix(prefix) {
    let node = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    return this._collectWords(node);
  }

  // Collect all words (full objects) from the given node
  _collectWords(node) {
    let results = [];
    if (node.isEndOfWord) results.push(node.data);

    for (let char in node.children) {
      results.push(...this._collectWords(node.children[char]));
    }

    return results;
  }
}

// React Component
const TrieSearch = ({ data , closeCallback, openCallback , editCallback}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const trieRef = useRef(new Trie()); // Persist Trie across renders

  // Insert data into Trie only once
  useEffect(() => {
    const trie = trieRef.current;
    trie.clear(); // Clear previous data
    data.forEach((item) => {
      if (item.name) trie.insert(item.name, item);
    });
  }, [data]); // Runs only when `data` changes

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setResults(value ? trieRef.current.searchPrefix(value) : []);
  };

  return (
    <div >
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by session name..."
        className="border p-2 rounded w-full"
        style={{margin: '20px 0px !important', width: '100%'}}
      />
     
     {results.length > 0 ? (
        <ul style={{padding:'2px 0px !important'}} className="test rounded">
          {results.map((session,index) => (
             <div key={`${index}-${session?.id}`} className="session" >
             <li className="session-item" onClick={()=>openCallback(session?.id)}>
               {session?.name}   
             </li>
           </div>
          ))}
        </ul>  
      ) : (
     

      data.length > 0 ? 
        <div className="sessions">
            <ul>
              {data.map((session, index) => {
                return (
                  <div key={`${index}-${session?.id}`} className="session" >
                    <li className="session-item" style={{cursor:'pointer'}} onClick={()=>openCallback(session?.id)}>
                      {session?.name}   
                    </li>
                    <div className="button-group">
                    {/* <button className="close-btn" onClick={()=>editCallback(session?.id)}> ✏️ </button>  */}
                    <button className="close-btn" onClick={()=>closeCallback(session?.id)}> ❌ </button> 
                    </div>
                  </div>
                );
              })}
            </ul>
        </div> :  <div className="test"> No sessions found</div> 
      )}
    </div>
  );
};

export default TrieSearch;