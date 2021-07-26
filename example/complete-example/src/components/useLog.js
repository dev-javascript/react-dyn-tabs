import React, {useState, useRef, useEffect} from 'react';
const useLog = () => {
  const logRef = useRef(null);
  let [messages, setMessages] = useState('');
  const addMessage = (message) => {
    console.log(message);
    messages = messages + '\n' + message;
    setMessages(messages);
  };
  useEffect(() => {
    logRef.current.scrollTo(0, logRef.current.scrollHeight);
  });
  const ConsoleComponent = () => {
    return (
      <div className="log-container">
        <div className="log" ref={logRef}>
          <pre>{messages}</pre>
          {messages && (
            <button
              className="clear-log"
              onClick={() => {
                setMessages('');
              }}>
              clear
            </button>
          )}
        </div>
      </div>
    );
  };
  return [ConsoleComponent, addMessage];
};
export default useLog;
