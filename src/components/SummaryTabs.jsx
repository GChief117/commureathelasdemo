// -----------------------------------------------------------------------------
//  <SummaryTabs/> – Card that shows Short / Long / Quoted summaries.
//  Lets user copy or open <DownloadModal/>.
// -----------------------------------------------------------------------------
import * as React from "react";
import {
  TabList,
  Tab,
  Card,
  Text,
  Button,
  makeStyles,
  useId
} from "@fluentui/react-components";
import { DataContext } from "../App";
import DownloadModal from "./DownloadModal";

const useStyles = makeStyles({
  root: { height: "100%" },
  tabArea: { marginBottom: "0.5rem" }
});

export default function SummaryTabs() {
  const styles = useStyles();
  const { summaries } = React.useContext(DataContext);
  const [selected, setSelected] = React.useState("short");
  const scrollId = useId("summaryScroll");

  return (
    <Card className={`summary-card ${styles.root}`}>
      {/* Tabs for switching which summary is visible */}
      <div className={styles.tabArea}>
        <TabList selectedValue={selected} onTabSelect={(_, d) => setSelected(d.value)}>
          <Tab value="short">Short Summary</Tab>
          <Tab value="long">Long Summary</Tab>
          <Tab value="quoted">Quoted Summary</Tab>
        </TabList>
      </div>

      {/* Scrollable body */}
      <div id={scrollId} className="summary-scroll">
        <Text>{summaries[selected]}</Text>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <DownloadModal />
        <Button appearance="secondary">Copy {selected} Summary</Button>
      </div>
    </Card>
  );
}
