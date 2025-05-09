// -----------------------------------------------------------------------------
//  <Footer/> – Responsive footer using Fluent UI <Link> and Flexbox styling.
//  Handles spacing and screen-reader accessibility better.
// -----------------------------------------------------------------------------
import * as React from "react";
import { Link, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  footer: {
    padding: "0.75rem 1rem",
    borderTop: "1px solid #e1e1e1",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "1rem",
    fontSize: "14px",
  },
});

export default function Footer() {
  const styles = useStyles();

  return (
    <footer className={styles.footer}>
      <Link href="#" underline="always">Help</Link>
      <Link href="#" underline="always">Manual</Link>
      <Link href="#" underline="always">Commure + Athelas</Link>
      <Link href="#" underline="always">Contact</Link>
    </footer>
  );
}
