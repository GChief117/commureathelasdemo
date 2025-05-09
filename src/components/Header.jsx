// -----------------------------------------------------------------------------
//  Header – static brand bar with logo (no editable text)
// -----------------------------------------------------------------------------
import * as React from "react";
import { Title1, Text, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  bar: {
    padding: "0.5rem 1rem",
    borderBottom: "1px solid #e1e1e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    height: "60px",
    objectFit: "contain",
    display: "block"
  }
});

export default function Header() {
  const s = useStyles();
  return (
    <div className={s.bar}>
      <div>
        <Title1>Commure Prototype </Title1>
        <Text size={300}>Commure + Athelas AI</Text>
      </div>
      <img src="/commure.jpeg" alt="Commure Logo" className={s.logo} />
    </div>
  );
}
