---
name: perf
description: "Analyze and optimize code performance. Use when the user says /perf, asks about performance, wants to optimize slow code, profile a bottleneck, reduce memory usage, or improve response times. Triggers: perf, performance, slow, optimize, bottleneck, profile, memory, latency, throughput, speed up."
---

# Performance Analyzer

Identify and resolve performance bottlenecks.

## Workflow

1. **Understand the problem:**
   - What is slow? (startup, specific endpoint, rendering, query, build)
   - What are the symptoms? (high latency, high CPU, high memory, timeouts)
   - What is the target? (e.g., "under 200ms", "half the memory")

2. **Profile before optimizing:**
   - Identify the hotspot. Never optimize blindly.
   - Use language-appropriate profiling:
     - **Python**: `cProfile`, `py-spy`, `memory_profiler`, `time.perf_counter`
     - **Node.js**: `--prof`, `clinic.js`, `console.time`, `perf_hooks`
     - **Go**: `pprof`, `go test -bench`
     - **Rust**: `cargo bench`, `flamegraph`
     - **General**: `time` command, `hyperfine` for benchmarks

3. **Analyze the code for common issues:**

### Common Performance Issues

| Category | What to look for |
|----------|-----------------|
| **Algorithm** | O(n^2) or worse where O(n log n) exists, unnecessary sorting |
| **Database** | N+1 queries, missing indexes, SELECT *, no pagination |
| **I/O** | Sequential where parallel is possible, no batching, no streaming |
| **Memory** | Large object copies, no generators/iterators, memory leaks, unbounded caches |
| **Caching** | Repeated expensive computations, no memoization, cache stampede |
| **Rendering** | Unnecessary re-renders, large DOM, no virtualization |
| **Network** | No compression, no connection pooling, chatty APIs |
| **Build** | No tree-shaking, large bundles, no code splitting |

4. **Propose fixes ranked by impact:**
   - Estimate improvement for each fix.
   - Start with the highest-impact, lowest-effort changes.
   - Include before/after benchmarks when possible.

5. **Verify improvements:**
   - Run benchmarks before and after.
   - Check for regressions in correctness.
   - Monitor for changes in memory usage.

## Guidelines

- Measure first, optimize second. Show numbers.
- The biggest gains are usually algorithmic, not micro-optimizations.
- Consider trade-offs: readability vs speed, memory vs CPU, latency vs throughput.
- Don't optimize code that runs rarely — focus on hot paths.
- Suggest caching strategies where appropriate but warn about invalidation complexity.
- For database issues, show the query plan (`EXPLAIN ANALYZE`).
