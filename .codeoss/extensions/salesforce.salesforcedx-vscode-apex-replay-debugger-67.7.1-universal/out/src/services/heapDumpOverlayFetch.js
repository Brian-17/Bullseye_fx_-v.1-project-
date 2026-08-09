"use strict";
/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHeapDumpOverlayResults = void 0;
const effect_ext_utils_1 = require("@salesforce/effect-ext-utils");
const salesforcedx_apex_replay_debugger_1 = require("@salesforce/salesforcedx-apex-replay-debugger");
const Arr = require("effect/Array");
const Chunk = require("effect/Chunk");
const Effect = require("effect/Effect");
const Function_1 = require("effect/Function");
const Predicate_1 = require("effect/Predicate");
const S = require("effect/Schema");
const Stream = require("effect/Stream");
// SOQL `IN` collections cap at 200 items; a single tooling query returns the full HeapDump
// compound field for each id — which /composite/batch does NOT (it returns only the sobject
// `attributes` stub, dropping HeapDump), so batching per-id GETs there yields empty overlays.
const MAX_QUERY_IDS = 200;
const QUERY_CONCURRENCY = 15;
class HeapDumpOverlayFetchError extends S.TaggedError()('HeapDumpOverlayFetchError', {
    cause: S.Unknown,
    message: S.String
}) {
}
/** Tooling query for a chunk of heap-dump ids, mapped to a HeapDumpResult per id (missing id → error). */
const runOverlayQuery = Effect.fn('heapDumpOverlayFetch.runOverlayQuery')(function* (conn, ids) {
    const soql = `SELECT Id, HeapDump, ApexResult, SOQLResult, Line, Iteration, ClassName, Namespace, IsDumpingHeap, OverlayResultLength FROM ApexExecutionOverlayResult WHERE Id IN (${ids
        .map(id => `'${id}'`)
        .join(',')})`;
    const result = yield* Effect.tryPromise({
        try: () => conn.tooling.query(soql),
        catch: error => new HeapDumpOverlayFetchError({
            cause: error,
            message: `Failed to fetch heap dump overlay results: ${(0, Predicate_1.isError)(error) ? error.message : String(error)}`
        })
    });
    const byId = new Map(result.records.map(record => [record.Id, record]));
    return ids.map((id) => {
        const record = byId.get(id);
        return record
            ? { heapDumpId: id, success: record }
            : { heapDumpId: id, error: `No overlay result found for ${id}` };
    });
});
/**
 * Extracts heap-dump ids from the log, dedups them, and fetches their overlay results via a
 * tooling SOQL query (200 ids per query, up to 15 queries in flight). A single query returns the
 * full HeapDump compound field per id; /composite/batch omits it, so a query is used instead.
 * Resolves the target-org connection from the services extension via ExtensionProviderService.
 */
exports.fetchHeapDumpOverlayResults = Effect.fn('heapDumpOverlayFetch.fetchHeapDumpOverlayResults')(function* (logFileContents) {
    const conn = yield* (yield* effect_ext_utils_1.ExtensionProviderService).getServicesApi.pipe(Effect.flatMap(api => api.services.ConnectionService.getConnection()));
    return yield* (0, Function_1.pipe)((0, salesforcedx_apex_replay_debugger_1.extractHeapDumpIdsFromLog)(logFileContents.split(/\r?\n/)), Arr.map(entry => entry.heapDumpId), Arr.dedupe, Stream.fromIterable, Stream.grouped(MAX_QUERY_IDS), Stream.mapEffect(chunk => runOverlayQuery(conn, Chunk.toArray(chunk)), { concurrency: QUERY_CONCURRENCY }), Stream.flattenIterables, Stream.runCollect, Effect.map(Chunk.toArray));
});
//# sourceMappingURL=heapDumpOverlayFetch.js.map