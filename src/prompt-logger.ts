import Database from "better-sqlite3";
import { mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import {
  PromptLogEntry,
  PromptLogFilters,
  PromptLogDeleteCriteria,
  LLMProvider,
  LLMRequest,
  LLMResponse,
} from "./types.js";

// Constants
const TABLE_NAME = "prompt_logs";
const CONFIG_DIR_NAME = "cross-llm-mcp";
const DB_FILE_NAME = "prompts.db";
const PROJECT_CONFIG_DIR = ".cross-llm-mcp";

// SQL Query Constants
const SELECT_ALL_FROM_TABLE = `SELECT * FROM ${TABLE_NAME}`;
const DELETE_FROM_TABLE = `DELETE FROM ${TABLE_NAME}`;
const COUNT_FROM_TABLE = `SELECT COUNT(*) as count FROM ${TABLE_NAME}`;
const WHERE_1_EQ_1 = " WHERE 1=1";
const ORDER_BY_TIMESTAMP_DESC = " ORDER BY timestamp DESC";
const AND_PROVIDER_EQ = " AND provider = ?";
const AND_MODEL_EQ = " AND model = ?";
const AND_TIMESTAMP_GTE = " AND timestamp >= ?";
const AND_TIMESTAMP_LTE = " AND timestamp <= ?";
const AND_TIMESTAMP_LT = " AND timestamp < ?";
const AND_PROMPT_LIKE = " AND LOWER(prompt) LIKE ?";
const LIMIT_CLAUSE = " LIMIT ?";
const WHERE_ID_EQ = " WHERE id = ?";
const WHERE_MODEL_NOT_NULL = " WHERE model IS NOT NULL";
const WHERE_USAGE_NOT_NULL = " WHERE usage IS NOT NULL";

// Schema Constants
const CREATE_TABLE_SCHEMA = `
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        provider TEXT NOT NULL,
        model TEXT,
        prompt TEXT NOT NULL,
        response TEXT,
        temperature REAL,
        max_tokens INTEGER,
        usage TEXT,
        error TEXT,
        duration_ms INTEGER
      );

      CREATE INDEX IF NOT EXISTS idx_timestamp ON ${TABLE_NAME}(timestamp);
      CREATE INDEX IF NOT EXISTS idx_provider ON ${TABLE_NAME}(provider);
      CREATE INDEX IF NOT EXISTS idx_model ON ${TABLE_NAME}(model);
    `;

// Determine database file location
function getPromptsDbPath(): string {
  const userConfigDir =
    process.platform === "win32"
      ? join(process.env.APPDATA || homedir(), CONFIG_DIR_NAME)
      : join(homedir(), `.${CONFIG_DIR_NAME}`);

  const projectDir = process.cwd();
  const projectConfigPath = join(projectDir, PROJECT_CONFIG_DIR, DB_FILE_NAME);

  const userConfigPath = join(userConfigDir, DB_FILE_NAME);

  try {
    if (!existsSync(userConfigDir)) {
      mkdirSync(userConfigDir, { recursive: true });
    }
    return userConfigPath;
  } catch {
    try {
      const projectConfigDir = dirname(projectConfigPath);
      if (!existsSync(projectConfigDir)) {
        mkdirSync(projectConfigDir, { recursive: true });
      }
      return projectConfigPath;
    } catch {
      return userConfigPath;
    }
  }
}

// Ensure directory exists for database file
function ensureDbDirectory(dbPath: string): void {
  const dbDir = dirname(dbPath);
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }
}

// Initialize database schema
function initializeSchema(db: Database.Database): void {
  db.exec(CREATE_TABLE_SCHEMA);
}

// Get or create database instance
let dbInstance: Database.Database | null = null;

function getDatabase(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = getPromptsDbPath();
  ensureDbDirectory(dbPath);

  try {
    dbInstance = new Database(dbPath);
    dbInstance.prepare("SELECT 1").get(); // Test connection
    initializeSchema(dbInstance);
    return dbInstance;
  } catch (error) {
    console.error("CRITICAL: Error initializing database:", error);
    console.error("Database path:", dbPath);
    dbInstance = null;
    throw new Error(`Failed to initialize database at ${dbPath}: ${error}`);
  }
}

// Generate unique ID for log entry
function generateLogId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${random}`;
}

// Prepare log entry data for insertion
function prepareLogEntryData(
  provider: LLMProvider,
  request: LLMRequest,
  response: LLMResponse,
  durationMs?: number,
): {
  id: string;
  timestamp: string;
  provider: LLMProvider;
  model: string | null;
  prompt: string;
  response: string | null;
  temperature: number | null;
  max_tokens: number | null;
  usage: string | null;
  error: string | null;
  duration_ms: number | null;
} {
  const id = generateLogId();
  const timestamp = new Date().toISOString();
  const usageJson = response.usage ? JSON.stringify(response.usage) : null;

  return {
    id,
    timestamp,
    provider,
    model: response.model || request.model || null,
    prompt: request.prompt,
    response: response.error ? null : response.response || null,
    temperature: request.temperature ?? null,
    max_tokens: request.max_tokens ?? null,
    usage: usageJson,
    error: response.error || null,
    duration_ms: durationMs ?? null,
  };
}

// Build WHERE clause for filters
function buildFilterClause(
  filters: PromptLogFilters,
  query: string,
  params: any[],
): string {
  let result = query;
  if (filters.provider) {
    result += AND_PROVIDER_EQ;
    params.push(filters.provider);
  }

  if (filters.model) {
    result += AND_MODEL_EQ;
    params.push(filters.model);
  }

  if (filters.startDate) {
    result += AND_TIMESTAMP_GTE;
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    result += AND_TIMESTAMP_LTE;
    params.push(filters.endDate);
  }

  if (filters.searchText) {
    result += AND_PROMPT_LIKE;
    params.push(`%${filters.searchText.toLowerCase()}%`);
  }
  return result;
}

// Build WHERE clause for delete criteria
function buildDeleteClause(
  criteria: PromptLogDeleteCriteria,
  query: string,
  params: any[],
): string {
  let result = query;
  if (criteria.provider) {
    result += AND_PROVIDER_EQ;
    params.push(criteria.provider);
  }

  if (criteria.model) {
    result += AND_MODEL_EQ;
    params.push(criteria.model);
  }

  if (criteria.startDate) {
    result += AND_TIMESTAMP_GTE;
    params.push(criteria.startDate);
  }

  if (criteria.endDate) {
    result += AND_TIMESTAMP_LTE;
    params.push(criteria.endDate);
  }

  if (criteria.olderThanDays) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - criteria.olderThanDays);
    result += AND_TIMESTAMP_LT;
    params.push(cutoffDate.toISOString());
  }
  return result;
}

// Convert database row to PromptLogEntry
function rowToLogEntry(row: any): PromptLogEntry {
  let usageObj;
  try {
    usageObj = row.usage ? JSON.parse(row.usage) : undefined;
  } catch (parseError) {
    console.error(
      "Error parsing usage JSON:",
      parseError,
      "Raw usage:",
      row.usage,
    );
    usageObj = undefined;
  }

  return {
    id: row.id,
    timestamp: row.timestamp,
    provider: row.provider as LLMProvider,
    model: row.model || undefined,
    prompt: row.prompt,
    response: row.response || undefined,
    temperature: row.temperature ?? undefined,
    max_tokens: row.max_tokens ?? undefined,
    usage: usageObj,
    error: row.error || undefined,
    duration_ms: row.duration_ms ?? undefined,
  };
}

// Check if query returned unexpected empty results
function checkEmptyResultDebug(
  db: Database.Database,
  rows: any[],
  query: string,
  filters?: PromptLogFilters,
): void {
  if (rows.length === 0 && (!filters || Object.keys(filters).length === 0)) {
    try {
      const countStmt = db.prepare(COUNT_FROM_TABLE);
      const count = countStmt.get() as { count: number };
      if (count.count > 0) {
        console.error(
          `Warning: Query returned 0 rows but table has ${count.count} rows. Query: ${query}`,
        );
      }
    } catch {
      // Ignore count check errors
    }
  }
}

// Append a new log entry
export function appendLogEntry(
  provider: LLMProvider,
  request: LLMRequest,
  response: LLMResponse,
  durationMs?: number,
): void {
  try {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO ${TABLE_NAME} (
        id, timestamp, provider, model, prompt, response,
        temperature, max_tokens, usage, error, duration_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const data = prepareLogEntryData(provider, request, response, durationMs);

    stmt.run(
      data.id,
      data.timestamp,
      data.provider,
      data.model,
      data.prompt,
      data.response,
      data.temperature,
      data.max_tokens,
      data.usage,
      data.error,
      data.duration_ms,
    );
  } catch (error) {
    // Don't throw - logging failures shouldn't break main functionality
    console.error("Error appending log entry:", error);
  }
}

// Get log entries with optional filters
export function getLogEntries(filters?: PromptLogFilters): PromptLogEntry[] {
  try {
    const db = getDatabase();
    let query = SELECT_ALL_FROM_TABLE + WHERE_1_EQ_1;
    const params: any[] = [];

    if (filters) {
      query = buildFilterClause(filters, query, params);
    }

    query += ORDER_BY_TIMESTAMP_DESC;

    if (filters?.limit && filters.limit > 0) {
      query += LIMIT_CLAUSE;
      params.push(filters.limit);
    }

    const stmt = db.prepare(query);
    const rows = stmt.all(...params) as any[];

    checkEmptyResultDebug(db, rows, query, filters);

    return rows.map(rowToLogEntry);
  } catch (error) {
    console.error("Error getting log entries:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.stack : String(error),
    );
    return [];
  }
}

// Delete log entries matching criteria
export function deleteLogEntries(criteria: PromptLogDeleteCriteria): number {
  try {
    const db = getDatabase();

    if (criteria.id) {
      const stmt = db.prepare(DELETE_FROM_TABLE + WHERE_ID_EQ);
      const result = stmt.run(criteria.id);
      return result.changes;
    }

    let query = DELETE_FROM_TABLE + WHERE_1_EQ_1;
    const params: any[] = [];
    query = buildDeleteClause(criteria, query, params);

    const stmt = db.prepare(query);
    const result = stmt.run(...params);
    return result.changes;
  } catch (error) {
    console.error("Error deleting log entries:", error);
    throw new Error(`Failed to delete log entries: ${error}`);
  }
}

// Clear all log entries
export function clearAllLogs(): number {
  try {
    const db = getDatabase();
    const stmt = db.prepare(DELETE_FROM_TABLE);
    const result = stmt.run();
    return result.changes;
  } catch (error) {
    console.error("Error clearing logs:", error);
    throw new Error(`Failed to clear logs: ${error}`);
  }
}

// Get total entry count
function getTotalEntryCount(db: Database.Database): number {
  const stmt = db.prepare(COUNT_FROM_TABLE);
  const result = stmt.get() as { count: number };
  return result.count;
}

// Get oldest and newest timestamps
function getTimestampRange(db: Database.Database): {
  oldest?: string;
  newest?: string;
} {
  const stmt = db.prepare(
    `SELECT MIN(timestamp) as oldest, MAX(timestamp) as newest FROM ${TABLE_NAME}`,
  );
  const result = stmt.get() as { oldest: string; newest: string };
  return {
    oldest: result.oldest || undefined,
    newest: result.newest || undefined,
  };
}

// Get counts grouped by provider
function getProviderCounts(db: Database.Database): Record<LLMProvider, number> {
  const counts: Record<LLMProvider, number> = {} as Record<LLMProvider, number>;
  const stmt = db.prepare(
    `SELECT provider, COUNT(*) as count FROM ${TABLE_NAME} GROUP BY provider`,
  );
  const rows = stmt.all() as Array<{ provider: string; count: number }>;
  rows.forEach((row) => {
    counts[row.provider as LLMProvider] = row.count;
  });
  return counts;
}

// Get counts grouped by model
function getModelCounts(db: Database.Database): Record<string, number> {
  const counts: Record<string, number> = {};
  const stmt = db.prepare(
    `SELECT model, COUNT(*) as count FROM ${TABLE_NAME}${WHERE_MODEL_NOT_NULL} GROUP BY model`,
  );
  const rows = stmt.all() as Array<{ model: string; count: number }>;
  rows.forEach((row) => {
    counts[row.model] = row.count;
  });
  return counts;
}

// Calculate total tokens from usage JSON
function calculateTotalTokens(db: Database.Database): number {
  let totalTokens = 0;
  const stmt = db.prepare(
    `SELECT usage FROM ${TABLE_NAME}${WHERE_USAGE_NOT_NULL}`,
  );
  const rows = stmt.all() as Array<{ usage: string }>;
  rows.forEach((row) => {
    try {
      const usage = JSON.parse(row.usage);
      if (usage?.total_tokens) {
        totalTokens += usage.total_tokens;
      }
    } catch {
      // Skip invalid JSON
    }
  });
  return totalTokens;
}

// Get statistics about logs
export function getLogStats(): {
  totalEntries: number;
  byProvider: Record<LLMProvider, number>;
  byModel: Record<string, number>;
  totalTokens: number;
  oldestEntry?: string;
  newestEntry?: string;
} {
  try {
    const db = getDatabase();
    const totalEntries = getTotalEntryCount(db);

    const stats = {
      totalEntries,
      byProvider: {} as Record<LLMProvider, number>,
      byModel: {} as Record<string, number>,
      totalTokens: 0,
      oldestEntry: undefined as string | undefined,
      newestEntry: undefined as string | undefined,
    };

    if (totalEntries === 0) {
      return stats;
    }

    const { oldest, newest } = getTimestampRange(db);
    stats.oldestEntry = oldest;
    stats.newestEntry = newest;
    stats.byProvider = getProviderCounts(db);
    stats.byModel = getModelCounts(db);
    stats.totalTokens = calculateTotalTokens(db);

    return stats;
  } catch (error) {
    console.error("Error getting log stats:", error);
    return {
      totalEntries: 0,
      byProvider: {} as Record<LLMProvider, number>,
      byModel: {},
      totalTokens: 0,
    };
  }
}

// Get prompts log file path (for informational purposes)
export function getPromptsLogFilePath(): string {
  return getPromptsDbPath();
}
