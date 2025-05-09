// src/components/PermitFilters.jsx
// -----------------------------------------------------------------------------
// <PermitFilters/> – mobile-first dropdown row for RCM case study
// -----------------------------------------------------------------------------
import * as React from 'react';
import {
  Dropdown,
  Option,
  Label,
  makeStyles
} from '@fluentui/react-components';
import { PermitContext } from '../App';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1rem 1rem 2rem',
    '@media (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'flex-end'
    }
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '180px',
    flex: 1
  }
});

export default function PermitFilters() {
  const css = useStyles();
  const { filters, setFilters } = React.useContext(PermitContext);

  const update = key => (_, d) =>
    setFilters({ ...filters, [key]: d.optionValue });

  const practices = [
    'North Valley Hospital',
    'City Ortho-Surgery',
    'Sunrise Pediatrics'
  ];
  const payers = ['Aetna', 'Blue Cross', 'UnitedHealthcare', 'Medicare'];
  const statuses = ['Queued', 'Submitted', 'Paid', 'Denied'];
  const reasons = [
    'None',           // <-- new “not denied” option
    'Coding',
    'Eligibility',
    'Authorization',
    'Timely Filing'
  ];

  return (
    <div className={css.row}>
      {/* Practice */}
      <div className={css.col}>
        <Label>Practice</Label>
        <Dropdown
          placeholder="Select practice"
          value={filters.practice}
          onOptionSelect={update('practice')}
        >
          {practices.map(p => (
            <Option key={p} value={p}>
              {p}
            </Option>
          ))}
        </Dropdown>
      </div>

      {/* Payer */}
      <div className={css.col}>
        <Label>Payer</Label>
        <Dropdown
          placeholder="Select payer"
          value={filters.payer}
          onOptionSelect={update('payer')}
        >
          {payers.map(p => (
            <Option key={p} value={p}>
              {p}
            </Option>
          ))}
        </Dropdown>
      </div>

      {/* Claim Status */}
      <div className={css.col}>
        <Label>Claim Status</Label>
        <Dropdown
          placeholder="Select status"
          value={filters.claimStatus}
          onOptionSelect={update('claimStatus')}
        >
          {statuses.map(s => (
            <Option key={s} value={s}>
              {s}
            </Option>
          ))}
        </Dropdown>
      </div>

      {/* Denial Reason */}
      <div className={css.col}>
        <Label>Denial Reason</Label>
        <Dropdown
          placeholder="Select reason"
          value={filters.denialReason}
          onOptionSelect={update('denialReason')}
        >
          {reasons.map(r => (
            <Option key={r} value={r}>
              {r}
            </Option>
          ))}
        </Dropdown>
      </div>
    </div>
  );
}
