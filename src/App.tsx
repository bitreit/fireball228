import { Header } from './components/layout/Header';
import { InputPanel } from './components/panels/InputPanel';
import { ResultsPanel } from './components/panels/ResultsPanel';

function App() {
  return (
    <div className="flex flex-col h-screen bg-[#080d1a] overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0">
        <InputPanel />
        <ResultsPanel />
      </div>
    </div>
  );
}

export default App;
