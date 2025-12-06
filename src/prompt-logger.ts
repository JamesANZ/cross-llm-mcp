import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
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

// Determine prompts log file location (same as preferences)
function getPromptsLogPath(): string {
  const userConfigDir =
    process.platform === "win32"
      ? join(process.env.APPDATA || homedir(), "cross-llm-mcp")
      : join(homedir(), ".cross-llm-mcp");

  const projectDir = process.cwd();
  const projectConfigPath = join(projectDir, ".cross-llm-mcp", "prompts.json");

  const userConfigPath = join(userConfigDir, "prompts.json");

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

// Generate unique ID for log entry
function generateLogId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${random}`;
}

// Load all log entries from file
function loadLogEntries(): PromptLogEntry[] {
  const logPath = getPromptsLogPath();
  if (!existsSync(logPath)) {
    return [];
  }

  try {
    const fileContent = readFileSync(logPath, "utf-8");
    const entries = JSON.parse(fileContent) as PromptLogEntry[];
    return Array.isArray(entries) ? entries : [];
  } catch (error) {
    // If file is corrupted, return empty array
    console.error("Error reading prompts log file:", error);
    return [];
  }
}

// Save log entries to file
function saveLogEntries(entries: PromptLogEntry[]): void {
  const logPath = getPromptsLogPath();
  const logDir = dirname(logPath);

  // Ensure directory exists
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
  }

  try {
    writeFileSync(logPath, JSON.stringify(entries, null, 2), "utf-8");
  } catch (error) {
    throw new Error(`Failed to save prompts log: ${error}`);
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
    const entries = loadLogEntries();
    const entry: PromptLogEntry = {
      id: generateLogId(),
      timestamp: new Date().toISOString(),
      provider,
      model: response.model || request.model,
      prompt: request.prompt,
      response: response.error ? undefined : response.response,
      temperature: request.temperature,
      max_tokens: request.max_tokens,
      usage: response.usage,
      error: response.error,
      duration_ms: durationMs,
    };

    entries.push(entry);
    saveLogEntries(entries);
  } catch (error) {
    // Don't throw - logging failures shouldn't break main functionality
    console.error("Error appending log entry:", error);
  }
}

// Get log entries with optional filters
export function getLogEntries(filters?: PromptLogFilters): PromptLogEntry[] {
  try {
    let entries = loadLogEntries();

    // Apply filters
    if (filters) {
      // Filter by provider
      if (filters.provider) {
        entries = entries.filter((e) => e.provider === filters.provider);
      }

      // Filter by model
      if (filters.model) {
        entries = entries.filter((e) => e.model === filters.model);
      }

      // Filter by date range
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        entries = entries.filter((e) => new Date(e.timestamp) >= startDate);
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        entries = entries.filter((e) => new Date(e.timestamp) <= endDate);
      }

      // Search in prompt text
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        entries = entries.filter((e) =>
          e.prompt.toLowerCase().includes(searchLower),
        );
      }
    }

    // Sort by timestamp (newest first)
    entries.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    // Apply limit
    if (filters?.limit && filters.limit > 0) {
      entries = entries.slice(0, filters.limit);
    }

    return entries;
  } catch (error) {
    console.error("Error getting log entries:", error);
    return [];
  }
}

// Delete log entries matching criteria
export function deleteLogEntries(criteria: PromptLogDeleteCriteria): number {
  try {
    let entries = loadLogEntries();
    const originalCount = entries.length;

    // If specific ID provided, delete just that one
    if (criteria.id) {
      entries = entries.filter((e) => e.id !== criteria.id);
    } else {
      // Apply filters
      entries = entries.filter((entry) => {
        // Filter by provider
        if (criteria.provider && entry.provider !== criteria.provider) {
          return true; // Keep entry
        }

        // Filter by model
        if (criteria.model && entry.model !== criteria.model) {
          return true; // Keep entry
        }

        // Filter by date range
        if (criteria.startDate) {
          const startDate = new Date(criteria.startDate);
          if (new Date(entry.timestamp) < startDate) {
            return true; // Keep entry
          }
        }

        if (criteria.endDate) {
          const endDate = new Date(criteria.endDate);
          if (new Date(entry.timestamp) > endDate) {
            return true; // Keep entry
          }
        }

        // Filter by older than X days
        if (criteria.olderThanDays) {
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - criteria.olderThanDays);
          if (new Date(entry.timestamp) >= cutoffDate) {
            return true; // Keep entry
          }
        }

        // Entry matches all criteria, delete it
        return false;
      });
    }

    const deletedCount = originalCount - entries.length;
    if (deletedCount > 0) {
      saveLogEntries(entries);
    }

    return deletedCount;
  } catch (error) {
    console.error("Error deleting log entries:", error);
    throw new Error(`Failed to delete log entries: ${error}`);
  }
}

// Clear all log entries
export function clearAllLogs(): number {
  try {
    const entries = loadLogEntries();
    const count = entries.length;
    saveLogEntries([]);
    return count;
  } catch (error) {
    console.error("Error clearing logs:", error);
    throw new Error(`Failed to clear logs: ${error}`);
  }
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
    const entries = loadLogEntries();
    const stats = {
      totalEntries: entries.length,
      byProvider: {} as Record<LLMProvider, number>,
      byModel: {} as Record<string, number>,
      totalTokens: 0,
      oldestEntry: undefined as string | undefined,
      newestEntry: undefined as string | undefined,
    };

    if (entries.length === 0) {
      return stats;
    }

    // Calculate statistics
    const timestamps = entries.map((e) => new Date(e.timestamp).getTime());
    stats.oldestEntry =
      entries[timestamps.indexOf(Math.min(...timestamps))].timestamp;
    stats.newestEntry =
      entries[timestamps.indexOf(Math.max(...timestamps))].timestamp;

    entries.forEach((entry) => {
      // Count by provider
      stats.byProvider[entry.provider] =
        (stats.byProvider[entry.provider] || 0) + 1;

      // Count by model
      if (entry.model) {
        stats.byModel[entry.model] = (stats.byModel[entry.model] || 0) + 1;
      }

      // Sum tokens
      if (entry.usage?.total_tokens) {
        stats.totalTokens += entry.usage.total_tokens;
      }
    });

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
  return getPromptsLogPath();
}
