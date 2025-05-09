// -----------------------------------------------------------------------------
//  <Filters/> – Flexible row of Fluent UI <Dropdown>s.
//  Updates shared 'filters' state in DataContext so any child can read it.
// -----------------------------------------------------------------------------
import * as React from "react";
import {
  Dropdown,
  Option,
  Label,
  makeStyles
} from "@fluentui/react-components";
import { DataContext } from "../App";

// simple styling helper
const useStyles = makeStyles({
  row: { display: "flex", gap: "1rem", padding: "0 1rem 1rem" },
  col: { display: "flex", flexDirection: "column", minWidth: "180px" }
});

export default function Filters() {
  const styles = useStyles();
  const { filters, setFilters } = React.useContext(DataContext);

  // curried helper to update a specific field
  const update = (field) => (_, data) =>
    setFilters({ ...filters, [field]: data.optionValue });

  // mock option lists – replace with REST call later
  const dockets = ["RM17-10-00", "RM18-1-00"];
  const commenters = [
    "National and State Conservation Organizations",
    "Utility Trade Group"
  ];
  const topics = [
    "Coordination of Planning and Generation IX",
    "Transmission Inter‑regional"
  ];

  return (
    <div className={styles.row}>
      {/* Docket selector */}
      <div className={styles.col}>
        <Label>Docket</Label>
        <Dropdown value={filters.docket} onOptionSelect={update("docket")}>
          {dockets.map((d) => (
            <Option key={d} value={d}>
              {d}
            </Option>
          ))}
        </Dropdown>
      </div>

      {/* Commenter selector */}
      <div className={styles.col}>
        <Label>Commenter</Label>
        <Dropdown
          value={filters.commenter}
          onOptionSelect={update("commenter")}
        >
          {commenters.map((c) => (
            <Option key={c} value={c}>
              {c}
            </Option>
          ))}
        </Dropdown>
      </div>

      {/* Topic selector */}
      <div className={styles.col}>
        <Label>Topic</Label>
        <Dropdown value={filters.topic} onOptionSelect={update("topic")}>
          {topics.map((t) => (
            <Option key={t} value={t}>
              {t}
            </Option>
          ))}
        </Dropdown>
      </div>

      {/* Free‑type accession number (can later become another list) */}
      <div className={styles.col}>
        <Label>Accession #</Label>
        <Dropdown
          placeholder="Select Accession…"
          onOptionSelect={update("accession")}
        />
      </div>
    </div>
  );
}
