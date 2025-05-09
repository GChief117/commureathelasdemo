// -----------------------------------------------------------------------------
//  <PhaseStepper/> – progress bar + phase labels
//  • Labels scroll sideways on phones instead of clipping
// -----------------------------------------------------------------------------
import * as React from "react";
import { ProgressBar, makeStyles } from "@fluentui/react-components";
import { PermitContext } from "../App";

const phases = [
  "Pre‑Filing","Application","NEPA Review","Public Comment",
  "Inter‑Agency","Technical Review","Decision","Compliance"
];

/* style helper */
const use = makeStyles({
  bar:{
    display:"flex",
    gap:"0.5rem",
    marginBottom:"1rem",
    overflowX:"auto"    /* enables swipe scroll on narrow screens */
  },
  step:{ fontSize:"12px" }
});

export default function PhaseStepper(){
  const { filters } = React.useContext(PermitContext);
  const s = use();

  return (
    <div>
      <ProgressBar value={filters.phase / (phases.length - 1)} />
      <div className={s.bar}>
        {phases.map((p,i)=>(
          <span key={p} className={s.step}
                style={{fontWeight:i===filters.phase?600:400}}>
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
