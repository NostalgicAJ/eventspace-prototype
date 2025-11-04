"use client";
import { useMemo, useState } from "react";

const rentals = [
  { id: 1, name: "LED Wall", price: 5000, rating: 4.6, cat: "Visuals" },
  { id: 2, name: "Sound System", price: 3000, rating: 4.4, cat: "Audio" },
  { id: 3, name: "Booth Stall (10x10)", price: 2000, rating: 4.2, cat: "Infrastructure" },
  { id: 4, name: "Stage Lights", price: 2500, rating: 4.3, cat: "Lighting" },
  { id: 5, name: "Crowd Barriers", price: 1200, rating: 4.1, cat: "Safety" },
  { id: 6, name: "Power Generator", price: 4500, rating: 4.5, cat: "Power" },
];

function BarChart({ manual, eventspace }){
  const width=560, height=260, pad=40;
  const max = Math.max(manual, eventspace);
  const mH = (manual/max)*(height-2*pad);
  const eH = (eventspace/max)*(height-2*pad);
  return (
    <svg width="100%" viewBox={"0 0 "+width+" "+height}>
      <rect x="0" y="0" width={width} height={height} fill="#ffffff" stroke="#e5e7eb" />
      <line x1={pad} y1={height-pad} x2={width-pad} y2={height-pad} stroke="#9ca3af" />
      <g>
        <rect x={width/3-30} y={height-pad-mH} width="60" height={mH} fill="#c7d2fe" />
        <text x={width/3} y={height-pad+18} textAnchor="middle" fontSize="12">Manual</text>
        <text x={width/3} y={height-pad-mH-6} textAnchor="middle" fontSize="12">{manual}h</text>
      </g>
      <g>
        <rect x={2*width/3-30} y={height-pad-eH} width="60" height={eH} fill="#93c5fd" />
        <text x={2*width/3} y={height-pad+18} textAnchor="middle" fontSize="12">EventSpace</text>
        <text x={2*width/3} y={height-pad-eH-6} textAnchor="middle" fontSize="12">{eventspace}h</text>
      </g>
    </svg>
  );
}

export default function Page(){
  const [step, setStep] = useState(0);
  const [eventName, setEventName] = useState("");
  const [college, setCollege] = useState("");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("All");

  const total = useMemo(()=>cart.reduce((s,i)=>s+i.price,0),[cart]);
  const add = (item)=>{
    if(!cart.some(c=>c.id===item.id)){
      setCart([...cart, item]);
      setToast(`Added “${item.name}”`);
      setTimeout(()=>setToast(""), 1500);
    }
  };
  const filtered = rentals.filter(r => filter==="All" || r.cat===filter);

  return (
    <div className="container">
      <h1 className="title">EventSpace · Rentals for College Fests</h1>

      <div className="nav">
        {["Welcome","Event Setup","Map","Booking","Analytics"].map((label,i)=> (
          <button key={i} className={"btn "+(step===i?"primary":"")} onClick={()=>setStep(i)}>{label}</button>
        ))}
      </div>

      {step===0 && (
        <div className="card center">
          <h2>Rent Smarter. Plan Faster.</h2>
          <p className="muted">Everything your fest needs — booths, lights, sound systems, and sponsors — in one place.</p>
          <div className="spacer"></div>
          <button className="btn primary" onClick={()=>setStep(1)}>Create My Event</button>
        </div>
      )}

      {step===1 && (
        <div className="card">
          <div className="row">
            <div className="col-6">
              <label>Event Name</label>
              <input value={eventName} placeholder="TechTatva 2025" onChange={e=>setEventName(e.target.value)} />
            </div>
            <div className="col-6">
              <label>College</label>
              <input value={college} placeholder="MIT Manipal" onChange={e=>setCollege(e.target.value)} />
            </div>
            <div className="col-6">
              <label>Budget Range</label>
              <select><option>₹50k–₹1L</option><option>₹1L–₹3L</option><option>₹3L+</option></select>
            </div>
            <div className="col-6">
              <label>Type of Fest</label>
              <select><option>Tech</option><option>Cultural</option><option>Business</option><option>Sports</option></select>
            </div>
          </div>
          <div className="spacer"></div>
          <button className="btn primary" onClick={()=>setStep(2)}>Continue to Map</button>
        </div>
      )}

      {step===2 && (
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div className="kpi">
              <span className="pill">{eventName || "Untitled Event"}</span>
              <span className="pill">{college || "Your College"}</span>
              <span className="pill">Cart: {cart.length} items</span>
            </div>
            <div>
              <select value={filter} onChange={e=>setFilter(e.target.value)}>
                {["All","Visuals","Audio","Infrastructure","Lighting","Safety","Power"].map(x=>(<option key={x}>{x}</option>))}
              </select>
              &nbsp;
              <button className="btn" onClick={()=>setStep(3)}>View Booking</button>
            </div>
          </div>

          <div className="row">
            <div className="col-8">
              <div className="map">
                {Array.from({length:18}).map((_,i)=> (
                  <div key={i} className="stall" onClick={()=>add(filtered[i%filtered.length] || rentals[0])}>
                    <span>Stall {i+1}</span>
                  </div>
                ))}
              </div>
              {toast && <div className="toast">✅ {toast}</div>}
            </div>
            <div className="col-4">
              <div className="card">
                <h3>Available Rentals</h3>
                <ul className="list">
                  {filtered.map(item => (
                    <li key={item.id}>
                      <div>
                        <div style={{fontWeight:700}}>{item.name}</div>
                        <div style={{fontSize:12,color:"#6b7280"}}>₹{item.price} · ⭐ {item.rating}</div>
                      </div>
                      <button className="btn" onClick={()=>add(item)}>Add</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {step===3 && (
        <div className="card">
          <h3>Booking Summary</h3>
          {cart.length===0 ? <p>No items yet. Go back to Map to add rentals.</p> : (
            <ul className="list">
              {cart.map(item => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="spacer"></div>
          <div className="row">
            <div className="col-6"><div className="card">Subtotal</div></div>
            <div className="col-6"><div className="card" style={{textAlign:"right"}}>₹{total}</div></div>
          </div>
          <div className="spacer"></div>
          <div className="center">
            <button className="btn primary" onClick={()=>setStep(4)}>Complete Booking</button>
          </div>
        </div>
      )}

      {step===4 && (
        <div className="card">
          <h3>Analytics Dashboard</h3>
          <div className="kpi">
            <div className="card"><div style={{fontSize:12,color:"#6b7280"}}>Average Booking Time Saved</div><div style={{fontSize:24,fontWeight:800}}>22 hrs</div></div>
            <div className="card"><div style={{fontSize:12,color:"#6b7280"}}>Total Rentals</div><div style={{fontSize:24,fontWeight:800}}>{cart.length}</div></div>
            <div className="card"><div style={{fontSize:12,color:"#6b7280"}}>Vendor Rating (avg)</div><div style={{fontSize:24,fontWeight:800}}>{(cart.reduce((s,i)=>s+i.rating,0)/Math.max(cart.length,1)).toFixed(1)} ⭐</div></div>
          </div>
          <div className="spacer"></div>
          <BarChart manual={30} eventspace={8} />
          <div className="spacer"></div>
          <div className="center">
            <button className="btn" onClick={()=>setStep(0)}>Restart Prototype</button>
          </div>
          <div className="spacer"></div>
          <div className="card center">
            <b>Monetisation:</b> 10% commission · Featured vendor slots · Sponsor analytics add-on<br/>
            <b>Retention:</b> Duplicate last year’s event layout & vendors in 1 click
          </div>
        </div>
      )}
    </div>
  );
}
