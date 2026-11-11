import assert from "node:assert/strict";
import { transitionJob } from "../src/async-job-manager.ts";
import type { AsyncJob } from "../src/types.ts";

function processingJob(): AsyncJob {
  return {
    id: "job-1",
    status: "processing",
    provider: "grok",
    request: { prompt: "hello" },
    createdAt: "t0",
    updatedAt: "t0",
  };
}

const cancelled = processingJob();
assert.equal(
  transitionJob(cancelled, "cancelled", undefined, undefined, "t1"),
  true,
);
assert.equal(cancelled.status, "cancelled");
assert.equal(cancelled.completedAt, "t1");

assert.equal(
  transitionJob(
    cancelled,
    "completed",
    { provider: "grok", response: "late" },
    undefined,
    "t2",
  ),
  false,
);
assert.equal(cancelled.status, "cancelled");
assert.equal(cancelled.response, undefined);
assert.equal(cancelled.completedAt, "t1");

const failed = processingJob();
assert.equal(
  transitionJob(failed, "failed", undefined, "upstream down", "t3"),
  true,
);
assert.equal(failed.status, "failed");
assert.equal(failed.error, "upstream down");
assert.equal(failed.response, undefined);

console.log("job transition ok");
