const today = new Date();
export const todayLabel = today.toLocaleDateString('en-US', {
  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
});
export const todayISO = today.toISOString().split('T')[0];

export const applications = [
  { id: 'app1', name: 'Centene DB Pipeline',       abbr: 'CDP' },
  { id: 'app2', name: 'Claims Processing',          abbr: 'CP'  },
  { id: 'app3', name: 'Member Data Sync',           abbr: 'MDS' },
  { id: 'app4', name: 'Provider Analytics',         abbr: 'PA'  },
  { id: 'app5', name: 'Financial Reconciliation',   abbr: 'FR'  },
];

// ─── helpers ────────────────────────────────────────────────────────────────
const t = (h, m, s = 0) =>
  `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

const dur = (mins, secs) => (mins > 0 ? `${mins}m ` : '') + `${secs}s`;

const rows = (n) => n.toLocaleString();

const successLog = (name, table, count) =>
  `[INFO]  Job started: ${name}\n` +
  `[INFO]  Connecting to target database...\n` +
  `[INFO]  Connection established.\n` +
  `[INFO]  Reading source data...\n` +
  `[INFO]  ${rows(count)} rows fetched from source.\n` +
  `[INFO]  Applying transformations...\n` +
  `[INFO]  Writing to ${table}...\n` +
  `[INFO]  Commit successful.\n` +
  `[INFO]  Statistics updated.\n` +
  `[SUCCESS] Job completed. ${rows(count)} rows processed.`;

const failLog = (name, table, errorMsg) =>
  `[INFO]  Job started: ${name}\n` +
  `[INFO]  Connecting to target database...\n` +
  `[INFO]  Connection established.\n` +
  `[INFO]  Reading source data...\n` +
  `[INFO]  Applying transformations...\n` +
  `[ERROR] ${errorMsg}\n` +
  `[ERROR] Rolling back transaction on ${table}...\n` +
  `[ERROR] Rollback complete.\n` +
  `[FATAL] Job failed. No rows committed.`;

// ─── group definitions ───────────────────────────────────────────────────────
// GROUP 1 — ETL_INGESTION_GROUP  — ALL SUCCESS ✅
const grp1 = {
  id: 'grp1',
  name: 'ETL_INGESTION_GROUP',
  jobs: [
    { id:'g1j01', name:'EXTRACT_SOURCE_CLAIMS_DB',    status:'success', startTime:t(5,0),  endTime:t(5,2,34),  duration:dur(2,34), rowsProcessed:45230, database:'PROD_SRC_DB',    schema:'CLAIMS_RAW',   targetTable:'STG_CLAIMS_RAW',       errorMessage:null, logOutput:successLog('EXTRACT_SOURCE_CLAIMS_DB',   'STG_CLAIMS_RAW', 45230)   },
    { id:'g1j02', name:'TRANSFORM_MEMBER_RECORDS',    status:'success', startTime:t(5,3),  endTime:t(5,6,12),  duration:dur(3,12), rowsProcessed:32100, database:'PROD_DW',        schema:'STAGING',      targetTable:'STG_MEMBER_TRANSFORM',  errorMessage:null, logOutput:successLog('TRANSFORM_MEMBER_RECORDS',   'STG_MEMBER_TRANSFORM', 32100) },
    { id:'g1j03', name:'LOAD_CLAIMS_FACT_TABLE',      status:'success', startTime:t(5,7),  endTime:t(5,11,45), duration:dur(4,45), rowsProcessed:45230, database:'PROD_DW',        schema:'FACTS',        targetTable:'FACT_CLAIMS',           errorMessage:null, logOutput:successLog('LOAD_CLAIMS_FACT_TABLE',      'FACT_CLAIMS', 45230)         },
    { id:'g1j04', name:'EXTRACT_PROVIDER_FEED',       status:'success', startTime:t(5,12), endTime:t(5,13,20), duration:dur(1,20), rowsProcessed:8760,  database:'PROVIDER_SRC',   schema:'PROVIDER_RAW', targetTable:'STG_PROVIDER_RAW',      errorMessage:null, logOutput:successLog('EXTRACT_PROVIDER_FEED',      'STG_PROVIDER_RAW', 8760)      },
    { id:'g1j05', name:'TRANSFORM_PROVIDER_DATA',     status:'success', startTime:t(5,14), endTime:t(5,15,55), duration:dur(1,55), rowsProcessed:8760,  database:'PROD_DW',        schema:'STAGING',      targetTable:'STG_PROVIDER_TRANSFORM', errorMessage:null, logOutput:successLog('TRANSFORM_PROVIDER_DATA',    'STG_PROVIDER_TRANSFORM', 8760) },
    { id:'g1j06', name:'LOAD_PROVIDER_DIM',           status:'success', startTime:t(5,16), endTime:t(5,17,30), duration:dur(1,30), rowsProcessed:8760,  database:'PROD_DW',        schema:'DIMENSIONS',   targetTable:'DIM_PROVIDER',          errorMessage:null, logOutput:successLog('LOAD_PROVIDER_DIM',           'DIM_PROVIDER', 8760)          },
    { id:'g1j07', name:'EXTRACT_PHARMACY_DATA',       status:'success', startTime:t(5,18), endTime:t(5,19,48), duration:dur(1,48), rowsProcessed:21500, database:'PHARMA_SRC',     schema:'RX_RAW',       targetTable:'STG_PHARMACY_RAW',      errorMessage:null, logOutput:successLog('EXTRACT_PHARMACY_DATA',      'STG_PHARMACY_RAW', 21500)      },
    { id:'g1j08', name:'TRANSFORM_PHARMACY_RECORDS',  status:'success', startTime:t(5,20), endTime:t(5,22,10), duration:dur(2,10), rowsProcessed:21500, database:'PROD_DW',        schema:'STAGING',      targetTable:'STG_PHARMACY_TRANSFORM', errorMessage:null, logOutput:successLog('TRANSFORM_PHARMACY_RECORDS', 'STG_PHARMACY_TRANSFORM', 21500)},
    { id:'g1j09', name:'LOAD_PHARMACY_FACT',          status:'success', startTime:t(5,23), endTime:t(5,26,5),  duration:dur(3,5),  rowsProcessed:21500, database:'PROD_DW',        schema:'FACTS',        targetTable:'FACT_PHARMACY',         errorMessage:null, logOutput:successLog('LOAD_PHARMACY_FACT',          'FACT_PHARMACY', 21500)        },
    { id:'g1j10', name:'VALIDATE_ETL_COUNTS',         status:'success', startTime:t(5,27), endTime:t(5,28,0),  duration:dur(1,0),  rowsProcessed:75490, database:'PROD_DW',        schema:'AUDIT',        targetTable:'ETL_AUDIT_LOG',         errorMessage:null, logOutput:successLog('VALIDATE_ETL_COUNTS',         'ETL_AUDIT_LOG', 75490)        },
  ],
};

// GROUP 2 — DATA_VALIDATION_GROUP — ALL SUCCESS ✅
const grp2 = {
  id: 'grp2',
  name: 'DATA_VALIDATION_GROUP',
  jobs: [
    { id:'g2j01', name:'VALIDATE_MEMBER_KEYS',        status:'success', startTime:t(6,0),  endTime:t(6,1,5),   duration:dur(1,5),  rowsProcessed:32100, database:'PROD_DW', schema:'DIMENSIONS', targetTable:'DIM_MEMBER',            errorMessage:null, logOutput:successLog('VALIDATE_MEMBER_KEYS',        'DIM_MEMBER', 32100)         },
    { id:'g2j02', name:'VALIDATE_CLAIMS_INTEGRITY',   status:'success', startTime:t(6,2),  endTime:t(6,3,44),  duration:dur(1,44), rowsProcessed:45230, database:'PROD_DW', schema:'FACTS',      targetTable:'FACT_CLAIMS',           errorMessage:null, logOutput:successLog('VALIDATE_CLAIMS_INTEGRITY',   'FACT_CLAIMS', 45230)         },
    { id:'g2j03', name:'CHECK_REFERENTIAL_INTEGRITY', status:'success', startTime:t(6,4),  endTime:t(6,5,22),  duration:dur(1,22), rowsProcessed:98400, database:'PROD_DW', schema:'ALL',        targetTable:'INTEGRITY_CHECK_LOG',   errorMessage:null, logOutput:successLog('CHECK_REFERENTIAL_INTEGRITY', 'INTEGRITY_CHECK_LOG', 98400)  },
    { id:'g2j04', name:'VALIDATE_DATE_RANGES',        status:'success', startTime:t(6,6),  endTime:t(6,6,50),  duration:dur(0,50), rowsProcessed:45230, database:'PROD_DW', schema:'FACTS',      targetTable:'FACT_CLAIMS',           errorMessage:null, logOutput:successLog('VALIDATE_DATE_RANGES',        'FACT_CLAIMS', 45230)         },
    { id:'g2j05', name:'CHECK_NULL_CONSTRAINTS',      status:'success', startTime:t(6,7),  endTime:t(6,8,15),  duration:dur(1,15), rowsProcessed:98400, database:'PROD_DW', schema:'ALL',        targetTable:'NULL_CHECK_LOG',        errorMessage:null, logOutput:successLog('CHECK_NULL_CONSTRAINTS',      'NULL_CHECK_LOG', 98400)       },
    { id:'g2j06', name:'VALIDATE_BUSINESS_RULES',     status:'success', startTime:t(6,9),  endTime:t(6,11,30), duration:dur(2,30), rowsProcessed:45230, database:'PROD_DW', schema:'FACTS',      targetTable:'BIZ_RULE_AUDIT',        errorMessage:null, logOutput:successLog('VALIDATE_BUSINESS_RULES',     'BIZ_RULE_AUDIT', 45230)       },
    { id:'g2j07', name:'CHECK_DUPLICATE_RECORDS',     status:'success', startTime:t(6,12), endTime:t(6,13,40), duration:dur(1,40), rowsProcessed:45230, database:'PROD_DW', schema:'FACTS',      targetTable:'DUPLICATE_CHECK_LOG',   errorMessage:null, logOutput:successLog('CHECK_DUPLICATE_RECORDS',     'DUPLICATE_CHECK_LOG', 45230)  },
    { id:'g2j08', name:'VALIDATE_AMOUNT_RANGES',      status:'success', startTime:t(6,14), endTime:t(6,14,55), duration:dur(0,55), rowsProcessed:45230, database:'PROD_DW', schema:'FACTS',      targetTable:'FACT_CLAIMS',           errorMessage:null, logOutput:successLog('VALIDATE_AMOUNT_RANGES',      'FACT_CLAIMS', 45230)         },
    { id:'g2j09', name:'CHECK_CODE_LOOKUPS',          status:'success', startTime:t(6,15), endTime:t(6,16,20), duration:dur(1,20), rowsProcessed:12400, database:'PROD_DW', schema:'LOOKUPS',    targetTable:'CODE_LOOKUP_AUDIT',     errorMessage:null, logOutput:successLog('CHECK_CODE_LOOKUPS',          'CODE_LOOKUP_AUDIT', 12400)     },
    { id:'g2j10', name:'GENERATE_VALIDATION_REPORT',  status:'success', startTime:t(6,17), endTime:t(6,18,5),  duration:dur(1,5),  rowsProcessed:0,     database:'PROD_DW', schema:'REPORTS',    targetTable:'VALIDATION_REPORT',     errorMessage:null, logOutput:successLog('GENERATE_VALIDATION_REPORT',  'VALIDATION_REPORT', 0)        },
  ],
};

// GROUP 3 — REPORT_GENERATION_GROUP — 3 FAILURES ❌
const grp3 = {
  id: 'grp3',
  name: 'REPORT_GENERATION_GROUP',
  jobs: [
    { id:'g3j01', name:'GEN_DAILY_CLAIMS_REPORT',       status:'success', startTime:t(7,0),  endTime:t(7,3,15),  duration:dur(3,15), rowsProcessed:45230, database:'REPORT_DB', schema:'CLAIMS',    targetTable:'RPT_DAILY_CLAIMS',     errorMessage:null, logOutput:successLog('GEN_DAILY_CLAIMS_REPORT',       'RPT_DAILY_CLAIMS', 45230)     },
    { id:'g3j02', name:'GEN_MEMBER_SUMMARY_REPORT',     status:'success', startTime:t(7,4),  endTime:t(7,6,20),  duration:dur(2,20), rowsProcessed:32100, database:'REPORT_DB', schema:'MEMBERS',   targetTable:'RPT_MEMBER_SUMMARY',   errorMessage:null, logOutput:successLog('GEN_MEMBER_SUMMARY_REPORT',     'RPT_MEMBER_SUMMARY', 32100)   },
    { id:'g3j03', name:'GEN_PROVIDER_PERFORMANCE_RPT',  status:'success', startTime:t(7,7),  endTime:t(7,9,10),  duration:dur(2,10), rowsProcessed:8760,  database:'REPORT_DB', schema:'PROVIDERS', targetTable:'RPT_PROVIDER_PERF',    errorMessage:null, logOutput:successLog('GEN_PROVIDER_PERFORMANCE_RPT',  'RPT_PROVIDER_PERF', 8760)     },
    { id:'g3j04', name:'GEN_PHARMACY_UTILIZATION_RPT',  status:'success', startTime:t(7,10), endTime:t(7,11,45), duration:dur(1,45), rowsProcessed:21500, database:'REPORT_DB', schema:'PHARMACY',  targetTable:'RPT_PHARMACY_UTIL',    errorMessage:null, logOutput:successLog('GEN_PHARMACY_UTILIZATION_RPT',  'RPT_PHARMACY_UTIL', 21500)    },
    { id:'g3j05', name:'GEN_FINANCIAL_RECONCILIATION',  status:'success', startTime:t(7,12), endTime:t(7,15,30), duration:dur(3,30), rowsProcessed:18900, database:'REPORT_DB', schema:'FINANCE',   targetTable:'RPT_FINANCIAL_RECON',  errorMessage:null, logOutput:successLog('GEN_FINANCIAL_RECONCILIATION',  'RPT_FINANCIAL_RECON', 18900) },
    { id:'g3j06', name:'GEN_REGULATORY_COMPLIANCE_RPT', status:'success', startTime:t(7,16), endTime:t(7,18,5),  duration:dur(2,5),  rowsProcessed:5200,  database:'REPORT_DB', schema:'COMPLIANCE', targetTable:'RPT_REGULATORY',      errorMessage:null, logOutput:successLog('GEN_REGULATORY_COMPLIANCE_RPT', 'RPT_REGULATORY', 5200)        },
    { id:'g3j07', name:'GEN_AUDIT_TRAIL_REPORT',        status:'success', startTime:t(7,19), endTime:t(7,20,55), duration:dur(1,55), rowsProcessed:98400, database:'REPORT_DB', schema:'AUDIT',     targetTable:'RPT_AUDIT_TRAIL',      errorMessage:null, logOutput:successLog('GEN_AUDIT_TRAIL_REPORT',        'RPT_AUDIT_TRAIL', 98400)       },
    { id:'g3j08', name:'GEN_QUALITY_METRICS_REPORT',    status:'failed',  startTime:t(7,21), endTime:t(7,22,40), duration:dur(1,40), rowsProcessed:0,     database:'REPORT_DB', schema:'QUALITY',   targetTable:'RPT_QUALITY_METRICS',  errorMessage:'ORA-01555: snapshot too old: rollback segment number 12 with name "_SYSSMU12_2840587710$" too small', logOutput:failLog('GEN_QUALITY_METRICS_REPORT', 'RPT_QUALITY_METRICS', 'ORA-01555: snapshot too old: rollback segment number 12 with name "_SYSSMU12$" too small') },
    { id:'g3j09', name:'GEN_EXECUTIVE_DASHBOARD_RPT',   status:'failed',  startTime:t(7,23), endTime:t(7,24,12), duration:dur(1,12), rowsProcessed:0,     database:'REPORT_DB', schema:'EXECUTIVE', targetTable:'RPT_EXECUTIVE_DASH',   errorMessage:'ORA-04031: unable to allocate 65560 bytes of shared memory ("shared pool","unknown object","sga heap(1,0)","KGLHD")', logOutput:failLog('GEN_EXECUTIVE_DASHBOARD_RPT', 'RPT_EXECUTIVE_DASH', 'ORA-04031: unable to allocate 65560 bytes of shared memory') },
    { id:'g3j10', name:'GEN_COST_ANALYSIS_REPORT',      status:'failed',  startTime:t(7,25), endTime:t(7,26,50), duration:dur(1,50), rowsProcessed:0,     database:'REPORT_DB', schema:'FINANCE',   targetTable:'RPT_COST_ANALYSIS',    errorMessage:'ORA-00942: table or view does not exist: FINANCE.COST_ALLOCATION_2024', logOutput:failLog('GEN_COST_ANALYSIS_REPORT', 'RPT_COST_ANALYSIS', 'ORA-00942: table or view does not exist: FINANCE.COST_ALLOCATION_2024') },
  ],
};

// GROUP 4 — DATA_SYNC_GROUP — 2 FAILURES ❌
const grp4 = {
  id: 'grp4',
  name: 'DATA_SYNC_GROUP',
  jobs: [
    { id:'g4j01', name:'SYNC_MEMBER_MASTER_DATA',    status:'success', startTime:t(8,0),  endTime:t(8,4,10),  duration:dur(4,10), rowsProcessed:32100, database:'MASTER_DB',  schema:'MEMBERS',    targetTable:'MEMBER_MASTER',         errorMessage:null, logOutput:successLog('SYNC_MEMBER_MASTER_DATA',    'MEMBER_MASTER', 32100)       },
    { id:'g4j02', name:'SYNC_PROVIDER_DIRECTORY',    status:'success', startTime:t(8,5),  endTime:t(8,6,55),  duration:dur(1,55), rowsProcessed:8760,  database:'MASTER_DB',  schema:'PROVIDERS',  targetTable:'PROVIDER_DIRECTORY',    errorMessage:null, logOutput:successLog('SYNC_PROVIDER_DIRECTORY',    'PROVIDER_DIRECTORY', 8760)   },
    { id:'g4j03', name:'SYNC_CLAIMS_TO_DW',          status:'success', startTime:t(8,7),  endTime:t(8,11,20), duration:dur(4,20), rowsProcessed:45230, database:'PROD_DW',    schema:'FACTS',      targetTable:'FACT_CLAIMS',           errorMessage:null, logOutput:successLog('SYNC_CLAIMS_TO_DW',          'FACT_CLAIMS', 45230)         },
    { id:'g4j04', name:'SYNC_ELIGIBILITY_DATA',      status:'success', startTime:t(8,12), endTime:t(8,14,5),  duration:dur(2,5),  rowsProcessed:29400, database:'ELIG_DB',    schema:'ELIGIBILITY', targetTable:'ELIGIBILITY_CURRENT',  errorMessage:null, logOutput:successLog('SYNC_ELIGIBILITY_DATA',      'ELIGIBILITY_CURRENT', 29400) },
    { id:'g4j05', name:'SYNC_PHARMACY_RECORDS',      status:'success', startTime:t(8,15), endTime:t(8,17,30), duration:dur(2,30), rowsProcessed:21500, database:'PHARMA_DB',  schema:'RX',         targetTable:'RX_TRANSACTIONS',       errorMessage:null, logOutput:successLog('SYNC_PHARMACY_RECORDS',      'RX_TRANSACTIONS', 21500)      },
    { id:'g4j06', name:'SYNC_AUTHORIZATION_DATA',    status:'success', startTime:t(8,18), endTime:t(8,19,40), duration:dur(1,40), rowsProcessed:6300,  database:'AUTH_DB',    schema:'AUTH',       targetTable:'AUTH_RECORDS',          errorMessage:null, logOutput:successLog('SYNC_AUTHORIZATION_DATA',    'AUTH_RECORDS', 6300)          },
    { id:'g4j07', name:'SYNC_ENCOUNTER_DATA',        status:'success', startTime:t(8,20), endTime:t(8,23,15), duration:dur(3,15), rowsProcessed:38900, database:'ENCOUNTER_DB',schema:'ENCOUNTER',  targetTable:'ENCOUNTER_RECORDS',     errorMessage:null, logOutput:successLog('SYNC_ENCOUNTER_DATA',        'ENCOUNTER_RECORDS', 38900)    },
    { id:'g4j08', name:'SYNC_COORDINATION_BENEFITS', status:'success', startTime:t(8,24), endTime:t(8,25,50), duration:dur(1,50), rowsProcessed:4100,  database:'COB_DB',     schema:'COB',        targetTable:'COB_RECORDS',           errorMessage:null, logOutput:successLog('SYNC_COORDINATION_BENEFITS', 'COB_RECORDS', 4100)          },
    { id:'g4j09', name:'SYNC_CAPITATION_DATA',       status:'failed',  startTime:t(8,26), endTime:t(8,27,30), duration:dur(1,30), rowsProcessed:0,     database:'CAP_DB',     schema:'CAPITATION', targetTable:'CAPITATION_PAYMENTS',   errorMessage:'SQLSTATE 08S01: Communication link failure. The connection to the database server was lost during query execution.', logOutput:failLog('SYNC_CAPITATION_DATA', 'CAPITATION_PAYMENTS', 'SQLSTATE 08S01: Communication link failure. Connection to database server lost.') },
    { id:'g4j10', name:'SYNC_RISK_SCORES',           status:'failed',  startTime:t(8,28), endTime:t(8,29,10), duration:dur(1,10), rowsProcessed:0,     database:'RISK_DB',    schema:'RISK',       targetTable:'MEMBER_RISK_SCORES',    errorMessage:'Deadlock detected. Transaction rolled back. Another session holds an exclusive lock on table RISK.MEMBER_RISK_SCORES.', logOutput:failLog('SYNC_RISK_SCORES', 'MEMBER_RISK_SCORES', 'Deadlock detected. Transaction rolled back. Exclusive lock held by another session.') },
  ],
};

// GROUP 5 — ARCHIVE_CLEANUP_GROUP — 4 FAILURES ❌
const grp5 = {
  id: 'grp5',
  name: 'ARCHIVE_CLEANUP_GROUP',
  jobs: [
    { id:'g5j01', name:'ARCHIVE_HISTORICAL_CLAIMS',   status:'success', startTime:t(9,0),  endTime:t(9,6,20),  duration:dur(6,20), rowsProcessed:150400, database:'ARCHIVE_DB', schema:'CLAIMS',   targetTable:'ARC_CLAIMS_2023',      errorMessage:null, logOutput:successLog('ARCHIVE_HISTORICAL_CLAIMS',   'ARC_CLAIMS_2023', 150400)     },
    { id:'g5j02', name:'ARCHIVE_OLD_MEMBER_RECORDS',  status:'success', startTime:t(9,7),  endTime:t(9,10,15), duration:dur(3,15), rowsProcessed:78200,  database:'ARCHIVE_DB', schema:'MEMBERS',  targetTable:'ARC_MEMBERS_2023',     errorMessage:null, logOutput:successLog('ARCHIVE_OLD_MEMBER_RECORDS',  'ARC_MEMBERS_2023', 78200)     },
    { id:'g5j03', name:'CLEANUP_TEMP_STAGING_TABLES', status:'success', startTime:t(9,11), endTime:t(9,12,40), duration:dur(1,40), rowsProcessed:0,      database:'PROD_DW',    schema:'STAGING',  targetTable:'STG_*_TEMP',           errorMessage:null, logOutput:successLog('CLEANUP_TEMP_STAGING_TABLES', 'STG_TEMP_TABLES', 0)          },
    { id:'g5j04', name:'PURGE_EXPIRED_TOKENS',        status:'success', startTime:t(9,13), endTime:t(9,13,45), duration:dur(0,45), rowsProcessed:12300,  database:'AUTH_DB',    schema:'AUTH',     targetTable:'SESSION_TOKENS',       errorMessage:null, logOutput:successLog('PURGE_EXPIRED_TOKENS',        'SESSION_TOKENS', 12300)        },
    { id:'g5j05', name:'VACUUM_ANALYZE_INDEXES',      status:'success', startTime:t(9,14), endTime:t(9,17,30), duration:dur(3,30), rowsProcessed:0,      database:'PROD_DW',    schema:'ALL',      targetTable:'ALL_INDEXES',          errorMessage:null, logOutput:successLog('VACUUM_ANALYZE_INDEXES',      'ALL_INDEXES', 0)               },
    { id:'g5j06', name:'CLEANUP_ETL_LOG_TABLES',      status:'success', startTime:t(9,18), endTime:t(9,19,10), duration:dur(1,10), rowsProcessed:89500,  database:'PROD_DW',    schema:'AUDIT',    targetTable:'ETL_LOG_HISTORY',      errorMessage:null, logOutput:successLog('CLEANUP_ETL_LOG_TABLES',      'ETL_LOG_HISTORY', 89500)       },
    { id:'g5j07', name:'ARCHIVE_AUDIT_LOGS',          status:'failed',  startTime:t(9,20), endTime:t(9,21,5),  duration:dur(1,5),  rowsProcessed:0,      database:'ARCHIVE_DB', schema:'AUDIT',    targetTable:'ARC_AUDIT_2023',       errorMessage:'ORA-01652: unable to extend temp segment by 128 in tablespace TEMP. Tablespace is full.', logOutput:failLog('ARCHIVE_AUDIT_LOGS', 'ARC_AUDIT_2023', 'ORA-01652: unable to extend temp segment by 128 in tablespace TEMP. Tablespace is full.') },
    { id:'g5j08', name:'ARCHIVE_PROVIDER_HISTORY',   status:'failed',  startTime:t(9,22), endTime:t(9,23,20), duration:dur(1,20), rowsProcessed:0,      database:'ARCHIVE_DB', schema:'PROVIDERS','targetTable':'ARC_PROVIDERS_2023', errorMessage:'Timeout expired. The operation was cancelled after 60 seconds. Possible long-running transaction detected.', logOutput:failLog('ARCHIVE_PROVIDER_HISTORY', 'ARC_PROVIDERS_2023', 'Timeout expired after 60 seconds. Long-running transaction detected.') },
    { id:'g5j09', name:'ARCHIVE_FINANCIAL_RECORDS',  status:'failed',  startTime:t(9,24), endTime:t(9,25,15), duration:dur(1,15), rowsProcessed:0,      database:'ARCHIVE_DB', schema:'FINANCE',  targetTable:'ARC_FINANCE_2023',     errorMessage:'ORA-00060: deadlock detected while waiting for resource. Acquiring lock on ARC_FINANCE_2023.', logOutput:failLog('ARCHIVE_FINANCIAL_RECORDS', 'ARC_FINANCE_2023', 'ORA-00060: Deadlock detected while waiting for resource lock.') },
    { id:'g5j10', name:'PURGE_OLD_REPORT_DATA',      status:'failed',  startTime:t(9,26), endTime:t(9,27,0),  duration:dur(1,0),  rowsProcessed:0,      database:'REPORT_DB',  schema:'ARCHIVE',  targetTable:'RPT_ARCHIVE_2022',     errorMessage:'Permission denied. Current user ETLSVC does not have DELETE privilege on REPORT_DB.ARCHIVE.RPT_ARCHIVE_2022.', logOutput:failLog('PURGE_OLD_REPORT_DATA', 'RPT_ARCHIVE_2022', 'Permission denied. User ETLSVC lacks DELETE privilege on RPT_ARCHIVE_2022.') },
  ],
};

// GROUP 6 — INDEX_REBUILD_GROUP — 1 FAILURE ❌
const grp6 = {
  id: 'grp6',
  name: 'INDEX_REBUILD_GROUP',
  jobs: [
    { id:'g6j01', name:'REBUILD_CLAIMS_INDEXES',      status:'success', startTime:t(10,0),  endTime:t(10,5,30), duration:dur(5,30), rowsProcessed:0, database:'PROD_DW', schema:'FACTS',      targetTable:'FACT_CLAIMS',        errorMessage:null, logOutput:successLog('REBUILD_CLAIMS_INDEXES',      'FACT_CLAIMS', 0)         },
    { id:'g6j02', name:'REBUILD_MEMBER_INDEXES',      status:'success', startTime:t(10,6),  endTime:t(10,9,20), duration:dur(3,20), rowsProcessed:0, database:'PROD_DW', schema:'DIMENSIONS', targetTable:'DIM_MEMBER',         errorMessage:null, logOutput:successLog('REBUILD_MEMBER_INDEXES',      'DIM_MEMBER', 0)          },
    { id:'g6j03', name:'REBUILD_PROVIDER_INDEXES',    status:'success', startTime:t(10,10), endTime:t(10,12,5), duration:dur(2,5),  rowsProcessed:0, database:'PROD_DW', schema:'DIMENSIONS', targetTable:'DIM_PROVIDER',       errorMessage:null, logOutput:successLog('REBUILD_PROVIDER_INDEXES',    'DIM_PROVIDER', 0)        },
    { id:'g6j04', name:'REBUILD_PHARMACY_INDEXES',    status:'success', startTime:t(10,13), endTime:t(10,15,40),duration:dur(2,40), rowsProcessed:0, database:'PROD_DW', schema:'FACTS',      targetTable:'FACT_PHARMACY',      errorMessage:null, logOutput:successLog('REBUILD_PHARMACY_INDEXES',    'FACT_PHARMACY', 0)       },
    { id:'g6j05', name:'UPDATE_STATISTICS_CLAIMS',    status:'success', startTime:t(10,16), endTime:t(10,17,50),duration:dur(1,50), rowsProcessed:0, database:'PROD_DW', schema:'FACTS',      targetTable:'FACT_CLAIMS',        errorMessage:null, logOutput:successLog('UPDATE_STATISTICS_CLAIMS',    'FACT_CLAIMS', 0)         },
    { id:'g6j06', name:'UPDATE_STATISTICS_MEMBERS',   status:'success', startTime:t(10,18), endTime:t(10,19,30),duration:dur(1,30), rowsProcessed:0, database:'PROD_DW', schema:'DIMENSIONS', targetTable:'DIM_MEMBER',         errorMessage:null, logOutput:successLog('UPDATE_STATISTICS_MEMBERS',   'DIM_MEMBER', 0)          },
    { id:'g6j07', name:'UPDATE_STATISTICS_PROVIDERS', status:'success', startTime:t(10,20), endTime:t(10,21,10),duration:dur(1,10), rowsProcessed:0, database:'PROD_DW', schema:'DIMENSIONS', targetTable:'DIM_PROVIDER',       errorMessage:null, logOutput:successLog('UPDATE_STATISTICS_PROVIDERS', 'DIM_PROVIDER', 0)        },
    { id:'g6j08', name:'REBUILD_AUDIT_INDEXES',       status:'failed',  startTime:t(10,22), endTime:t(10,23,5), duration:dur(1,5),  rowsProcessed:0, database:'PROD_DW', schema:'AUDIT',      targetTable:'ETL_AUDIT_LOG',      errorMessage:'ORA-01578: ORACLE data block corrupted (file # 23, block # 44780). Block corruption detected during index rebuild.', logOutput:failLog('REBUILD_AUDIT_INDEXES', 'ETL_AUDIT_LOG', 'ORA-01578: Data block corrupted (file #23, block #44780). Corruption detected during index rebuild.') },
    { id:'g6j09', name:'UPDATE_STATISTICS_FINANCIAL', status:'success', startTime:t(10,24), endTime:t(10,25,0), duration:dur(1,0),  rowsProcessed:0, database:'PROD_DW', schema:'FINANCE',    targetTable:'FACT_FINANCIALS',    errorMessage:null, logOutput:successLog('UPDATE_STATISTICS_FINANCIAL', 'FACT_FINANCIALS', 0)    },
    { id:'g6j10', name:'REFRESH_MATERIALIZED_VIEWS',  status:'success', startTime:t(10,26), endTime:t(10,30,45),duration:dur(4,45), rowsProcessed:0, database:'PROD_DW', schema:'VIEWS',      targetTable:'MV_SUMMARY_*',       errorMessage:null, logOutput:successLog('REFRESH_MATERIALIZED_VIEWS',  'MV_SUMMARY_VIEWS', 0)   },
  ],
};

// GROUP 7 — MASTER_DATA_REFRESH — 5 FAILURES ❌
const grp7 = {
  id: 'grp7',
  name: 'MASTER_DATA_REFRESH',
  jobs: [
    { id:'g7j01', name:'REFRESH_MEMBER_MASTER',       status:'success', startTime:t(11,0),  endTime:t(11,4,20), duration:dur(4,20), rowsProcessed:32100, database:'MASTER_DB', schema:'MEMBERS',    targetTable:'MEMBER_MASTER',      errorMessage:null, logOutput:successLog('REFRESH_MEMBER_MASTER',       'MEMBER_MASTER', 32100)       },
    { id:'g7j02', name:'REFRESH_PROVIDER_MASTER',     status:'success', startTime:t(11,5),  endTime:t(11,7,10), duration:dur(2,10), rowsProcessed:8760,  database:'MASTER_DB', schema:'PROVIDERS',  targetTable:'PROVIDER_MASTER',    errorMessage:null, logOutput:successLog('REFRESH_PROVIDER_MASTER',     'PROVIDER_MASTER', 8760)       },
    { id:'g7j03', name:'REFRESH_DRUG_FORMULARY',      status:'success', startTime:t(11,8),  endTime:t(11,9,55), duration:dur(1,55), rowsProcessed:4200,  database:'MASTER_DB', schema:'PHARMACY',   targetTable:'DRUG_FORMULARY',     errorMessage:null, logOutput:successLog('REFRESH_DRUG_FORMULARY',      'DRUG_FORMULARY', 4200)        },
    { id:'g7j04', name:'REFRESH_NETWORK_CONTRACTS',   status:'success', startTime:t(11,10), endTime:t(11,12,30),duration:dur(2,30), rowsProcessed:1560,  database:'MASTER_DB', schema:'CONTRACTS',  targetTable:'NETWORK_CONTRACTS',  errorMessage:null, logOutput:successLog('REFRESH_NETWORK_CONTRACTS',   'NETWORK_CONTRACTS', 1560)     },
    { id:'g7j05', name:'REFRESH_AUTHORIZATION_RULES', status:'success', startTime:t(11,13), endTime:t(11,14,45),duration:dur(1,45), rowsProcessed:890,   database:'MASTER_DB', schema:'AUTH',       targetTable:'AUTHORIZATION_RULES', errorMessage:null, logOutput:successLog('REFRESH_AUTHORIZATION_RULES', 'AUTHORIZATION_RULES', 890)  },
    { id:'g7j06', name:'REFRESH_DIAGNOSIS_CODES',     status:'failed',  startTime:t(11,15), endTime:t(11,16,10),duration:dur(1,10), rowsProcessed:0,     database:'MASTER_DB', schema:'CLINICAL',   targetTable:'ICD10_DIAGNOSIS',    errorMessage:'Constraint violation: FK_DIAG_CATEGORY. Parent key not found in CLINICAL.DIAGNOSIS_CATEGORY. New ICD-10 codes reference unknown category IDs.', logOutput:failLog('REFRESH_DIAGNOSIS_CODES', 'ICD10_DIAGNOSIS', 'FK constraint violation: Parent key not found in DIAGNOSIS_CATEGORY for new ICD-10 codes.') },
    { id:'g7j07', name:'REFRESH_PROCEDURE_CODES',     status:'failed',  startTime:t(11,17), endTime:t(11,18,0), duration:dur(1,0),  rowsProcessed:0,     database:'MASTER_DB', schema:'CLINICAL',   targetTable:'CPT_PROCEDURE_CODES', errorMessage:'Check constraint CPT_PRICE_CHK violated. Procedure price cannot be negative. Source data contains negative reimbursement rates.', logOutput:failLog('REFRESH_PROCEDURE_CODES', 'CPT_PROCEDURE_CODES', 'Check constraint CPT_PRICE_CHK violated: Negative procedure prices in source data.') },
    { id:'g7j08', name:'REFRESH_FEE_SCHEDULES',       status:'failed',  startTime:t(11,19), endTime:t(11,20,15),duration:dur(1,15), rowsProcessed:0,     database:'MASTER_DB', schema:'FINANCE',    targetTable:'FEE_SCHEDULE_CURRENT',errorMessage:'Unique constraint UQ_FEE_SCHED_EFFDT violated. Duplicate effective dates found for provider group PG_SOUTHWEST_2024.', logOutput:failLog('REFRESH_FEE_SCHEDULES', 'FEE_SCHEDULE_CURRENT', 'UQ_FEE_SCHED_EFFDT unique constraint violated: Duplicate effective dates for PG_SOUTHWEST_2024.') },
    { id:'g7j09', name:'REFRESH_ELIGIBILITY_RULES',   status:'failed',  startTime:t(11,21), endTime:t(11,22,30),duration:dur(1,30), rowsProcessed:0,     database:'MASTER_DB', schema:'ELIGIBILITY', targetTable:'ELIGIBILITY_RULES',  errorMessage:'XML parsing error at line 4521: Unexpected end of element <BenefitRule>. Source eligibility XML file appears to be truncated.', logOutput:failLog('REFRESH_ELIGIBILITY_RULES', 'ELIGIBILITY_RULES', 'XML parse error at line 4521: Truncated source file. Unexpected end of <BenefitRule>.') },
    { id:'g7j10', name:'REFRESH_BENEFIT_PLANS',       status:'failed',  startTime:t(11,23), endTime:t(11,24,20),duration:dur(1,20), rowsProcessed:0,     database:'MASTER_DB', schema:'BENEFITS',   targetTable:'BENEFIT_PLAN_MASTER', errorMessage:'Source API returned HTTP 503 Service Unavailable. Benefit plan feed endpoint is temporarily down for maintenance.', logOutput:failLog('REFRESH_BENEFIT_PLANS', 'BENEFIT_PLAN_MASTER', 'HTTP 503 Service Unavailable. Benefit plan API feed endpoint is down for maintenance.') },
  ],
};

export const jobGroups = [grp1, grp2, grp3, grp4, grp5, grp6, grp7];

export function groupHasFailed(group) {
  return group.jobs.some((j) => j.status === 'failed');
}

export function groupStatus(group) {
  if (group.jobs.some((j) => j.status === 'failed')) return 'failed';
  if (group.jobs.some((j) => j.status === 'running')) return 'running';
  return 'success';
}

export function getStats() {
  let total = 0, success = 0, failed = 0;
  jobGroups.forEach((g) => g.jobs.forEach((j) => {
    total++;
    if (j.status === 'success') success++;
    if (j.status === 'failed') failed++;
  }));
  return { total, success, failed };
}
