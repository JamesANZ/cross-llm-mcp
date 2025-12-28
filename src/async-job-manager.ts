import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import {
  AsyncJob,
  AsyncJobStatus,
  LLMProvider,
  LLMRequest,
  LLMResponse,
} from "./types.js";
import { appendLogEntry } from "./prompt-logger.js";
import { LLMClients } from "./llm-clients.js";

// Determine async jobs file location (same as preferences)
function getAsyncJobsPath(): string {
  const userConfigDir =
    process.platform === "win32"
      ? join(process.env.APPDATA || homedir(), "cross-llm-mcp")
      : join(homedir(), ".cross-llm-mcp");

  const projectDir = process.cwd();
  const projectConfigPath = join(
    projectDir,
    ".cross-llm-mcp",
    "async-jobs.json",
  );

  const userConfigPath = join(userConfigDir, "async-jobs.json");

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

// Generate unique ID for job
function generateJobId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${random}`;
}

// Load all jobs from file
function loadJobs(): AsyncJob[] {
  const jobsPath = getAsyncJobsPath();
  if (!existsSync(jobsPath)) {
    return [];
  }

  try {
    const fileContent = readFileSync(jobsPath, "utf-8");
    const jobs = JSON.parse(fileContent) as AsyncJob[];
    return Array.isArray(jobs) ? jobs : [];
  } catch (error) {
    // If file is corrupted, return empty array
    console.error("Error reading async jobs file:", error);
    return [];
  }
}

// Save jobs to file
function saveJobs(jobs: AsyncJob[]): void {
  const jobsPath = getAsyncJobsPath();
  const jobsDir = dirname(jobsPath);

  // Ensure directory exists
  if (!existsSync(jobsDir)) {
    mkdirSync(jobsDir, { recursive: true });
  }

  try {
    writeFileSync(jobsPath, JSON.stringify(jobs, null, 2), "utf-8");
  } catch (error) {
    throw new Error(`Failed to save async jobs: ${error}`);
  }
}

// Create a new job
export function createJob(provider: LLMProvider, request: LLMRequest): string {
  try {
    const jobs = loadJobs();
    const now = new Date().toISOString();
    const job: AsyncJob = {
      id: generateJobId(),
      status: "pending",
      provider,
      request,
      createdAt: now,
      updatedAt: now,
    };

    jobs.push(job);
    saveJobs(jobs);
    return job.id;
  } catch (error) {
    console.error("Error creating job:", error);
    throw new Error(`Failed to create job: ${error}`);
  }
}

// Get job by ID
export function getJob(jobId: string): AsyncJob | null {
  try {
    const jobs = loadJobs();
    return jobs.find((job) => job.id === jobId) || null;
  } catch (error) {
    console.error("Error getting job:", error);
    return null;
  }
}

// Update job status
export function updateJobStatus(
  jobId: string,
  status: AsyncJobStatus,
  response?: LLMResponse,
  error?: string,
): void {
  try {
    const jobs = loadJobs();
    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    if (jobIndex === -1) {
      throw new Error(`Job ${jobId} not found`);
    }

    const job = jobs[jobIndex];
    job.status = status;
    job.updatedAt = new Date().toISOString();

    if (response) {
      job.response = response;
    }

    if (error) {
      job.error = error;
    }

    if (
      status === "completed" ||
      status === "failed" ||
      status === "cancelled"
    ) {
      job.completedAt = new Date().toISOString();
    }

    jobs[jobIndex] = job;
    saveJobs(jobs);
  } catch (error) {
    console.error("Error updating job status:", error);
    throw new Error(`Failed to update job status: ${error}`);
  }
}

// List jobs with optional filters
export function listJobs(filters?: {
  status?: AsyncJobStatus;
  provider?: LLMProvider;
  limit?: number;
}): AsyncJob[] {
  try {
    let jobs = loadJobs();

    // Apply filters
    if (filters) {
      if (filters.status) {
        jobs = jobs.filter((job) => job.status === filters.status);
      }

      if (filters.provider) {
        jobs = jobs.filter((job) => job.provider === filters.provider);
      }
    }

    // Sort by createdAt (newest first)
    jobs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Apply limit
    if (filters?.limit && filters.limit > 0) {
      jobs = jobs.slice(0, filters.limit);
    }

    return jobs;
  } catch (error) {
    console.error("Error listing jobs:", error);
    return [];
  }
}

// Delete job by ID
export function deleteJob(jobId: string): boolean {
  try {
    const jobs = loadJobs();
    const originalLength = jobs.length;
    const filteredJobs = jobs.filter((job) => job.id !== jobId);

    if (filteredJobs.length < originalLength) {
      saveJobs(filteredJobs);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting job:", error);
    return false;
  }
}

// Cleanup old jobs
export function cleanupOldJobs(olderThanDays: number): number {
  try {
    const jobs = loadJobs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const filteredJobs = jobs.filter((job) => {
      const jobDate = new Date(job.createdAt);
      return jobDate >= cutoffDate;
    });

    const deletedCount = jobs.length - filteredJobs.length;
    if (deletedCount > 0) {
      saveJobs(filteredJobs);
    }

    return deletedCount;
  } catch (error) {
    console.error("Error cleaning up old jobs:", error);
    return 0;
  }
}

// Job processor class
export class JobProcessor {
  private llmClients: LLMClients;
  private running: boolean = false;
  private currentlyProcessing: boolean = false;
  private processInterval?: NodeJS.Timeout;

  constructor(llmClients: LLMClients) {
    this.llmClients = llmClients;
  }

  // Start processing jobs
  start(): void {
    if (this.running) {
      return; // Already running
    }

    this.running = true;

    // Process immediately
    this.processNextJob();

    // Set up interval to check for new jobs every second
    this.processInterval = setInterval(() => {
      this.processNextJob();
    }, 1000);
  }

  // Stop processing jobs
  stop(): void {
    this.running = false;
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = undefined;
    }
  }

  // Process the next pending job
  private async processNextJob(): Promise<void> {
    if (!this.running || this.currentlyProcessing) {
      return;
    }

    try {
      // Get the first pending job
      const pendingJobs = listJobs({ status: "pending" });
      if (pendingJobs.length === 0) {
        return; // No jobs to process
      }

      const job = pendingJobs[0];

      // Mark as currently processing to prevent concurrent processing
      this.currentlyProcessing = true;

      // Update status to processing
      updateJobStatus(job.id, "processing");

      // Process the job and wait for it to complete
      await this.processJob(job);

      // Mark as no longer processing
      this.currentlyProcessing = false;
    } catch (error) {
      console.error("Error processing next job:", error);
      this.currentlyProcessing = false;
    }
  }

  // Process a single job
  private async processJob(job: AsyncJob): Promise<void> {
    const startTime = Date.now();

    try {
      // Call the LLM
      const response = await this.llmClients.callLLM(job.provider, job.request);

      // Update job status to completed
      updateJobStatus(job.id, "completed", response);

      // Log to prompt logger
      const duration = Date.now() - startTime;
      appendLogEntry(job.provider, job.request, response, duration);
    } catch (error: any) {
      const errorMessage = error.message || "Unknown error";
      const errorResponse: LLMResponse = {
        provider: job.provider,
        response: "",
        error: errorMessage,
      };

      // Update job status to failed
      updateJobStatus(job.id, "failed", errorResponse, errorMessage);

      // Log to prompt logger
      const duration = Date.now() - startTime;
      appendLogEntry(job.provider, job.request, errorResponse, duration);
    }
  }
}
