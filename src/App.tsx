import { useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getData();
  }, [count]);

  const getData = async () => {
    const data = await window.ipcRenderer.invoke('get-app-path', '2023-04-09');
    setCount(() => data);
  };

  const addCount = async () => {
    await window.ipcRenderer.invoke('write-data', '2023-04-09', count + 1);
    await getData();
  };

  return (
    <div className="App">
      <div className="card">
        <button onClick={addCount}>count is {count}</button>
        <button onClick={getData}>getData</button>
      </div>
    </div>
  );
}

export default App;
