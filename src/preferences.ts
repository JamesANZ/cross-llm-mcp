import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { UserPreferences, CostPreference } from "./types.js";

// Determine preferences file location
function getPreferencesPath(): string {
  // Try user config directory first
  const userConfigDir =
    process.platform === "win32"
      ? join(process.env.APPDATA || homedir(), "cross-llm-mcp")
      : join(homedir(), ".cross-llm-mcp");

  // Fallback to project directory if user config doesn't exist
  const projectDir = process.cwd();
  const projectConfigPath = join(
    projectDir,
    ".cross-llm-mcp",
    "preferences.json",
  );

  // Prefer user config directory, but use project directory as fallback
  const userConfigPath = join(userConfigDir, "preferences.json");

  // Check if user config directory exists or can be created
  try {
    if (!existsSync(userConfigDir)) {
      mkdirSync(userConfigDir, { recursive: true });
    }
    return userConfigPath;
  } catch {
    // If we can't use user config, try project directory
    try {
      const projectConfigDir = dirname(projectConfigPath);
      if (!existsSync(projectConfigDir)) {
        mkdirSync(projectConfigDir, { recursive: true });
      }
      return projectConfigPath;
    } catch {
      // Last resort: use user config path anyway (might fail on write)
      return userConfigPath;
    }
  }
}

// Load preferences from file or environment variables
export function loadPreferences(): UserPreferences {
  const prefs: UserPreferences = {};

  // First, try to load from file
  const prefsPath = getPreferencesPath();
  if (existsSync(prefsPath)) {
    try {
      const fileContent = readFileSync(prefsPath, "utf-8");
      const filePrefs = JSON.parse(fileContent) as UserPreferences;
      if (filePrefs.defaultModel) {
        prefs.defaultModel = filePrefs.defaultModel;
      }
      if (filePrefs.costPreference) {
        prefs.costPreference = filePrefs.costPreference;
      }
      if (filePrefs.tagPreferences) {
        prefs.tagPreferences = filePrefs.tagPreferences;
      }
    } catch (error) {
      // If file read fails, continue to env var fallback
      console.error("Error reading preferences file:", error);
    }
  }

  // Environment variable fallback/override
  const envDefaultModel = process.env.CROSS_LLM_DEFAULT_MODEL;
  const envCostPreference = process.env.CROSS_LLM_COST_PREFERENCE;

  if (envDefaultModel) {
    prefs.defaultModel = envDefaultModel;
  }

  if (envCostPreference === "flagship" || envCostPreference === "cheaper") {
    prefs.costPreference = envCostPreference as CostPreference;
  }

  return prefs;
}

// Save preferences to file
export function savePreferences(prefs: UserPreferences): void {
  const prefsPath = getPreferencesPath();
  const prefsDir = dirname(prefsPath);

  // Ensure directory exists
  if (!existsSync(prefsDir)) {
    mkdirSync(prefsDir, { recursive: true });
  }

  // Read existing preferences to merge
  let existingPrefs: UserPreferences = {};
  if (existsSync(prefsPath)) {
    try {
      const fileContent = readFileSync(prefsPath, "utf-8");
      existingPrefs = JSON.parse(fileContent) as UserPreferences;
    } catch {
      // If read fails, start fresh
      existingPrefs = {};
    }
  }

  // Merge preferences (new values override existing)
  const mergedPrefs: UserPreferences = {
    ...existingPrefs,
    ...prefs,
    // Deep merge tagPreferences
    tagPreferences: {
      ...existingPrefs.tagPreferences,
      ...prefs.tagPreferences,
    },
  };

  // Write to file
  try {
    writeFileSync(prefsPath, JSON.stringify(mergedPrefs, null, 2), "utf-8");
  } catch (error) {
    throw new Error(`Failed to save preferences: ${error}`);
  }
}

// Get preferences file path (for informational purposes)
export function getPreferencesFilePath(): string {
  return getPreferencesPath();
}
