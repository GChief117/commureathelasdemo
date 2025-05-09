// src/components/PermitChatbot.jsx
// -----------------------------------------------------------------------------
// <PermitChatbot/> – RCM Q&A with copy-to-clipboard (strips out ** markers)
// -----------------------------------------------------------------------------
import * as React from 'react';
import {
  Card,
  Input,
  Button,
  makeStyles
} from '@fluentui/react-components';
import { ArrowRight20Regular } from '@fluentui/react-icons';
import { PermitContext } from '../App';

const useStyles = makeStyles({
  root: { height: '100%' },
  chatContainer: {
    height: '700px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '0.75rem',
    gap: '0.5rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid #ddd',
    marginBottom: '0.75rem'
  },
  messageRow: { display: 'flex', width: '100%', justifyContent: 'flex-start' },
  messageText: { whiteSpace: 'pre-wrap', maxWidth: '75%' },
  tools: { display: 'flex', gap: '0.75rem', marginTop: '0.25rem', fontSize: '0.8rem' },
  toolButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    color: '#0078D4',
    fontWeight: 500
  }
});

const phaseLabels = [
  'Extract Encounters',
  'Submit Claims',
  'Reconcile Payments',
  'Denial Analysis',
  'Resubmission',
  'Revenue Reporting'
];

export default function PermitChatbot() {
  const css = useStyles();
  const { filters } = React.useContext(PermitContext);

  const [chatInput, setChatInput]     = React.useState('');
  const [conversation, setConversation] = React.useState([
    { role: 'assistant', text: 'Ask any question about the RCM phases shown on the left…' }
  ]);
  const [isLoading, setIsLoading]     = React.useState(false);
  const [copiedIdx, setCopiedIdx]     = React.useState(null);
  const endRef = React.useRef(null);

  React.useEffect(
    () => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); },
    [conversation, isLoading]
  );

  async function askBot() {
    if (!chatInput.trim()) return;
    setConversation(prev => [...prev, { role: 'user', text: chatInput }]);
    setIsLoading(true);

    const buildUserPrompt = () => {
      let ctx = 
`Practice      : ${filters.practice || 'Any'}
Payer         : ${filters.payer || 'Any'}
Claim Status  : ${filters.claimStatus || 'Any'}`;

      if (filters.claimStatus === 'Denied') {
        ctx += `\nDenial Reason : ${filters.denialReason || 'None'}`;
      }

      ctx += 
`\nCurrent Phase : ${phaseLabels[filters.phase]} (${filters.phase+1}/${phaseLabels.length})
Question      : ${chatInput}`;

      return ctx;
    };

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
            {
              role: 'system',
              content:
                'You are an expert assistant for hospital Revenue Cycle Management (RCM). ' +
                'You understand encounter extraction, claim submission, payment reconciliation, ' +
                'denial root-cause analysis, resubmission workflows, and revenue reporting KPIs.'
            },
            {
              role: 'user',
              content: buildUserPrompt()
            }
          ]
        })
      });

      const json = await res.json();
      // raw content from model
      const raw = json.choices?.[0]?.message?.content ?? 'No response.';
      // strip ALL "**" markers
      const cleaned = raw.replace(/\*\*/g, '');
      setConversation(prev => [...prev, { role: 'assistant', text: cleaned }]);
    } catch (err) {
      console.error(err);
      setConversation(prev => [
        ...prev,
        { role: 'assistant', text: 'Sorry, something went wrong.' }
      ]);
    } finally {
      setIsLoading(false);
      setChatInput('');
    }
  }

  function copyToClipboard(text, idx) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  return (
    <Card className={css.root}>
      {/* CHAT HISTORY */}
      <div className={css.chatContainer}>
        {conversation.map((m, i) => (
          <div
            key={i}
            className={css.messageRow}
            style={i === 0 ? { padding: 0, margin: 0 } : undefined}
          >
            <div>
              <div
                className={css.messageText}
                style={i === 0 ? { padding: 0, margin: 0, maxWidth: '100%' } : undefined}
              >
                <strong>{m.role === 'assistant' ? 'Assistant' : 'You'}:</strong> {m.text}
              </div>
              {m.role === 'assistant' && i !== 0 && (
                <div className={css.tools}>
                  <button
                    className={css.toolButton}
                    onClick={() => copyToClipboard(m.text, i)}
                  >
                    {copiedIdx === i ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className={css.messageRow}>
            <div className={css.messageText}><strong>Assistant:</strong> typing…</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* INPUT */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Input
          placeholder="Ask about claim workflows, denial rates, SLAs…"
          value={chatInput}
          onChange={(_, v) => setChatInput(v.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !isLoading) {
              e.preventDefault();
              askBot();
            }
          }}
          disabled={isLoading}
          style={{ flexGrow: 1 }}
        />
        <Button
          type="button"
          appearance="primary"
          icon={<ArrowRight20Regular />}
          onClick={askBot}
          disabled={isLoading}
        />
      </div>
    </Card>
  );
}
