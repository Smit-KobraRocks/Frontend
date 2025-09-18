import './App.css';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <div className="app__title-group">
            <span className="app__eyebrow">Pipeline Studio</span>
            <h1 className="app__brand">Design intelligent workflows</h1>
          </div>
          <p className="app__subtitle">
            Compose advanced automation by connecting logic, data, and AI-powered steps.
            Drag nodes into the canvas, configure them, and watch your ideas come to life.
          </p>
        </div>
        <div className="app__status">
          <span className="status-dot" aria-hidden="true"></span>
          <span>Autosave enabled — last synced moments ago</span>
        </div>
      </header>

      <main className="app__layout">
        <aside className="app__sidebar">
          <div className="sidebar__intro">
            <span className="sidebar__badge">Node Library</span>
            <h2 className="sidebar__title">Building blocks</h2>
            <p className="sidebar__description">
              Drag nodes into the canvas to assemble your automation pipeline. Each block can be
              configured in place once it has been dropped onto the flow.
            </p>
          </div>
          <PipelineToolbar />
        </aside>

        <section className="app__canvas">
          <div className="canvas__header">
            <div className="canvas__title">
              <span className="canvas__badge">Active canvas</span>
              <h2>Customer onboarding journey</h2>
            </div>
            <div className="canvas__actions" role="group" aria-label="Canvas actions">
              <button type="button" className="canvas__action-button canvas__action-button--ghost">
                Preview
              </button>
              <button type="button" className="canvas__action-button">
                Auto-layout
              </button>
            </div>
          </div>
          <PipelineUI />
        </section>
      </main>

      <footer className="app__footer">
        <SubmitButton />
      </footer>
    </div>
  );
}

export default App;
