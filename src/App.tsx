import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  window.ipcRenderer.invoke('get-app-path', '2023-04-09').then((result: any) => {
    console.log(result);
  });

  return (
    <div className="App">
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p></p>
      </div>
    </div>
  );
}

export default App;
