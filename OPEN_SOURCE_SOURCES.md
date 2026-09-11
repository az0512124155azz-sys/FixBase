# FixBase open-source / open-data sources

FixBase uses or links to open repair projects selectively, based on license compatibility and usefulness.

## Integrated live sources

### iFixit API v2.0
- API: https://www.ifixit.com/api/2.0/
- Use in FixBase: live autocomplete, device search, guide search and guide rendering.
- Most API reads do not require an app id.
- iFixit content is subject to iFixit's content license/terms (commonly CC BY-NC-SA). FixBase shows attribution and links to the original guide.
- Do not bulk-ingest or relicense iFixit content.

### RepairAI-Files
- Repository: https://github.com/kazemcodes/RepairAi-files
- License: MIT (repository code/documentation as stated by that project).
- Use in FixBase: on-demand index search and rendering of matching Markdown documentation from the public repository.
- FixBase does not mirror the full repository.

## Specialist sources linked by FixBase

### OpenBoardData
- Repository: https://github.com/warnerbryce/OpenBoardData
- Purpose: community known-good voltage, diode-mode and resistance measurements for board-level repair.
- Use in FixBase: specialist search result/link for board-level queries.
- Before copying any dataset files into FixBase, verify the license of the specific file/repository revision.

### BoardRipper
- Repository: https://github.com/AlexeyInwerp/BoardRipper
- License: AGPL-3.0.
- Purpose: browser-based boardview/schematic viewer.
- Use in FixBase: linked as an external open-source tool. Its code is not copied into FixBase, avoiding accidental AGPL licensing obligations for the main FixBase codebase.

## Other useful projects researched

### iFixit MCP
- Repository: https://github.com/Dthen/ifixit-mcp
- Code license: 0BSD.
- Purpose: compact server wrapper over the iFixit API.
- Note: iFixit data keeps its own license; the wrapper license does not change content rights.

### Open Repair Alliance
- Organization: https://github.com/openrepair
- Purpose: open repair event data and repair-data standards.
- Useful for future repair statistics, device taxonomy and repairability features rather than step-by-step guides.

### Wrench Board
- Repository: https://github.com/Junkz3/wrench-board
- Purpose: advanced board-level repair workbench.
- FixBase does not copy its code by default; license compatibility must be checked before integration.

## Integration policy

FixBase should prefer APIs and on-demand access over copying large third-party corpora. Every external result should preserve source attribution and original links. Before monetizing FixBase, review the terms of every data source, especially iFixit content.
