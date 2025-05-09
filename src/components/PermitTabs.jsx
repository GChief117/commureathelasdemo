// src/components/PermitTabs.jsx
// -----------------------------------------------------------------------------
// <PermitTabs/> – Tab section for hospital RCM (claims & denials) lifecycle
// • Shows selected PDF name above the Submit button
// • Phase tabs sync to context.phase
// • PDF.js + GPT review
// -----------------------------------------------------------------------------
import * as React from 'react';
import {
  TabList,
  Tab,
  Card,
  Text,
  Button,
  makeStyles
} from '@fluentui/react-components';
import {
  FiClipboard,
  FiSend,
  FiDollarSign,
  FiAlertCircle,
  FiRefreshCw,
  FiBarChart2,
  FiFileText
} from 'react-icons/fi';
import { PermitContext } from '../App';

// PDF.js import
import * as pdfjsLib from 'pdfjs-dist/webpack';
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const phases = [
  'Extract Encounters',
  'Submit Claims',
  'Reconcile Payments',
  'Denial Analysis',
  'Resubmission',
  'Revenue Reporting'
];
const icons = [
  FiClipboard,
  FiSend,
  FiDollarSign,
  FiAlertCircle,
  FiRefreshCw,
  FiBarChart2
];

const useStyles = makeStyles({
  card: {
    flex: '1 1 auto',
    minHeight: 0,
    padding: '1rem',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  },
  tabList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    paddingBottom: '0.75rem'
  },
  tabContent: {
    flex: '1 1 auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  centerBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    paddingBottom: '1rem'
  },
  reviewArea: {
    flex: '1 1 auto',
    minHeight: 0,
    overflowY: 'auto',
    width: '100%'
  }
});

export default function PermitTabs() {
  const css = useStyles();
  const { filters, setFilters } = React.useContext(PermitContext);

  const [sel, setSel]               = React.useState(filters.phase ?? 0);
  const [fileName, setFileName]     = React.useState('');
  const [pdfReview, setPdfReview]   = React.useState('');
  const fileInputRef                = React.useRef(null);
  const PhaseIcon                   = icons[sel];

  // keep context.phase in sync
  const onTabSelect = (_, d) => {
    setSel(d.value);
    setFilters({ ...filters, phase: d.value });
  };

  // extract PDF text and call GPT
  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    // 1) Extract text
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page    = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n\n';
    }

    // 2) Send to GPT
    const prompt =
      `You are an expert in hospital Revenue Cycle Management (RCM). ` +
      `Please review this document and point out missing fields, coding anomalies, ` +
      `or out-of-order steps:\n\n${text}`;

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: prompt },
            { role: 'user',   content: 'Please provide your review:' }
          ]
        })
      });
      const { choices } = await res.json();
      setPdfReview((choices?.[0]?.message?.content || 'No review returned.').trim());
    } catch {
      setPdfReview('Error reviewing document.');
    }
  };

  return (
    <Card className={css.card}>
      {/* Phase tabs */}
      <TabList
        selectedValue={sel}
        onTabSelect={onTabSelect}
        className={css.tabList}
      >
        {phases.map((phase, i) => (
          <Tab key={phase} value={i}>
            {phase}
          </Tab>
        ))}
      </TabList>

      <div className={css.tabContent}>
        <div className={css.centerBlock}>
          <PhaseIcon size={48} />

          <Text align="center">
            <strong>{phases[sel]}</strong> — placeholder summary for&nbsp;
            {filters.practice || 'your practice'}.
          </Text>

          {/* SHOW selected file name as a disabled feedback button */}
          {fileName && (
            <Button appearance="subtle" icon={<FiFileText />} disabled>
              {fileName}
            </Button>
          )}

          {/* hidden input + visible button */}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={onFileChange}
          />
          <Button
            type="button"
            appearance="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Submit PDF
          </Button>
        </div>

        {/* scrollable GPT review */}
        <div className={css.reviewArea}>
          {pdfReview && (
            <Card style={{ padding: '1rem', boxSizing: 'border-box' }}>
              <Text><strong>Document Review:</strong></Text>
              <Text style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>
                {pdfReview}
              </Text>
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
}
