export function TechVisual() {
  return <div className="tech-visual" aria-hidden="true">
    <div className="tech-scan"/>
    <div className="tech-orbit"><span className="orbit-plus a">+</span><span className="orbit-plus b">+</span></div>
    <div className="tech-orbit two"><span className="orbit-plus a">+</span><span className="orbit-plus b">+</span></div>
    <div className="tech-orbit three"><span className="orbit-plus a">+</span></div>
    <div className="tech-core"><span className="cog">⚙</span></div>
    <div className="tech-panel">
      <b>SYSTEM / DIMASO-01</b><br/>
      PLATFORM STATUS&nbsp;&nbsp;STABLE<br/>
      DELIVERY PIPELINE&nbsp;ACTIVE<br/>
      QA SIGNAL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PASS
      <span className="tech-bar"/>
    </div>
  </div>;
}
