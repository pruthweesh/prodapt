# PRODAPT — MASTER PROJECT BUILD & IMPLEMENTATION DOCUMENT

## Intelligent Product Adaptation & Multi-Market Business Expansion Platform

**Document type:** Consolidated architecture, product, agent, RAP, SDLC, technology, implementation, testing, deployment and operations guide  
**Purpose:** Single source of truth for building the Prodapt platform from MVP through scalable deployment  
**Source basis:** Consolidated from the five supplied Prodapt documents:
1. `Prodapt_Build_Guide.md`
2. `Prodapt_Building_an_Agent_with_RAP_Model.md`
3. `Prodapt_SDLC_Development_Guide.md`
4. `Prodapt_Technology_and_Tools_Stack.md`
5. `Prodapt_Tool_Stack.pdf`

---

# 1. EXECUTIVE OVERVIEW

Prodapt is an **Intelligent Product Adaptation & Multi-Market Business Expansion Platform**.

The platform takes a product and a target market, then runs a multi-agent AI pipeline that combines cultural intelligence, geographic intelligence, creative adaptation, visual generation, compliance validation, sales forecasting, risk simulation and business strategy into an actionable **Expansion Playbook**.

The core user experience has two map-driven sides:

- **Input:** Product information + brand assets + map-based target-market selection.
- **Output:** Interactive recommended-location map + adapted product variants + business recommendations + final Expansion Playbook.

The architecture is intentionally split into:

1. **Web application**
2. **API/backend layer**
3. **Knowledge/RAG layer**
4. **Seven-agent AI pipeline**
5. **Orchestration/job execution**
6. **Maps and live external tools**
7. **Storage/database**
8. **Testing, observability and deployment**

The platform is designed around **autonomous execution**: after product intake and target-market selection, the pipeline should complete without repeatedly asking the user for missing information. Missing information becomes an explicit assumption with a confidence level.

---

# 2. CORE PRODUCT OBJECTIVE

## 2.1 What Prodapt should accomplish

Given:

- Product name
- Product category
- Product description
- Existing brand assets
- Origin/current market information where available
- Target market selected through the map

Prodapt should produce:

- Market/cultural analysis
- Geographic opportunities
- Adaptation/design brief
- Multiple visual variants
- Compliance and cultural-sensitivity flags
- Sales forecast per variant
- Risk analysis
- Pricing/channel/timing recommendations
- Distribution recommendations
- Interactive map output
- Final Expansion Playbook

## 2.2 Core differentiator

Prodapt is not intended to provide only generic market insights.

The intended flow is:

**Understand the market → adapt the product → visualize the adaptation → validate it → estimate commercial potential → identify risks → recommend how/where/when to launch.**

---

# 3. PRODUCT SCOPE

## 3.1 Functional capabilities

### Product Intake
- Product name
- Category
- Description
- Base/current price where available
- Brand/logo assets
- Existing packaging/poster/UI screenshots or other reference assets

### Target Market Selection
- Interactive map
- Click/draw selection
- Reverse geocoding
- Place/region chips
- Multi-selection support

### Location Intelligence
- Demographics
- Cultural context
- Festivals
- Climate
- Regulations
- Competitor landscape
- Current market/trend information

### Geo-Intelligence
- Competitor density
- Distribution/retail targets
- High-footfall activation zones
- Premium vs. mass-market activation opportunities
- Map-ready scored pins

### Product/Creative Adaptation
- Color direction
- Imagery/motifs
- Layout
- Storyline/messaging
- Feature or ingredient changes where relevant
- Category-specific adaptation logic

### Visual Adaptation
- Brand-conditioned image generation
- 3–5 visual variants in the full product design
- Variant-specific regeneration

### Validation
- Cultural sensitivity
- Regulatory compliance
- Text validation
- Visual validation
- Grounded explanations for flags

### Commercial Analysis
- Success probability/forecast score
- Growth drivers
- Competitive positioning
- Market risks
- Regulatory/cultural/market risks

### Business Growth Strategy
- Pricing guidance
- Marketing channels
- Distribution plan
- Launch timing
- Market-entry recommendations

### Expansion Playbook
- Cultural report
- Creative brief
- Visual variants
- Compliance flags
- Sales forecast
- Risk report
- Pricing/channel/timing recommendations
- Interactive map

---

# 4. MVP SCOPE

The SDLC source recommends a deliberately narrow MVP.

## Must-have

- One product category initially
- One country/region pair for strong demo depth
- Map input
- Map output
- Three generated variants for MVP
- Autonomous mode
- Confidence scores
- End-to-end walking skeleton
- Curated knowledge base for demo markets
- Core agents sufficient to demonstrate the full adaptation loop

## Should/Could later

- More product categories
- More market pairs
- Human-in-the-loop review
- Enterprise licensing
- Multi-tenant billing
- Usage metering
- Advanced footfall data
- Large-scale managed infrastructure

The build documents specifically recommend starting with a concrete category such as **FMCG or F&B**, because packaging, ingredients and pricing provide clear adaptation levers.

---

# 5. FOUNDATIONAL ARCHITECTURE RULES

## 5.1 Define contracts before building agents

Prodapt is a pipeline of agents passing structured data to one another.

Before implementation, define for every agent:

- Input schema
- Output schema
- Required fields
- Optional fields
- Data sources
- Tool permissions
- Confidence fields
- Assumption fields
- Rationale
- Error/fallback behavior

The contracts should be treated as stable interfaces.

## 5.2 Data classification

Every data requirement belongs to one of three buckets.

| Data class | Examples | Handling |
|---|---|---|
| Static / slow-changing | Cultural norms, historical festival patterns, general regulations, past case studies | Pre-ingest into RAG/vector database |
| Live / fast-changing | Current competitors, current pricing, current trends, live weather | Query external API/tool at runtime |
| Pure reasoning | Risk scoring, forecasting, pricing recommendations | Model reasoning over trusted agent outputs |

Do not embed rapidly changing information such as current competitor listings into a static vector database and expect it to remain current.

## 5.3 Frontend/backend boundary

The frontend should **not call individual agents directly**.

Recommended flow:

`Frontend → Backend job endpoint → Orchestrator → Agents/tools → Final Playbook payload → Frontend`

The final backend response can contain:

- Text
- Structured data
- Image URLs
- Map pin data
- Confidence/assumption information
- Job status

---

# 6. HIGH-LEVEL SYSTEM ARCHITECTURE

```text
┌──────────────────────────────────────────────────────────────┐
│                       FRONTEND WEB APP                       │
│ Product Intake │ Map Selector │ Progress │ Playbook Viewer │
│ Variant Viewer │ Interactive Output Map                    │
└─────────────────────────────┬────────────────────────────────┘
                              │ REST + WebSocket/SSE
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    API / BFF LAYER                           │
│ Authentication │ Validation │ Job Creation │ API Responses  │
└─────────────────────────────┬────────────────────────────────┘
                              ▼
┌──────────────────────────────────────────────────────────────┐
│               ORCHESTRATION / JOB LAYER                     │
│ LangGraph │ Celery + Redis │ retries │ timeouts │ state     │
│ parallel execution │ scoped re-runs │ intermediate outputs  │
└───────┬────────┬────────┬────────┬────────┬────────┬─────────┘
        │        │        │        │        │        │
        ▼        ▼        ▼        ▼        ▼        ▼
     Cultural Creative  Visual Compliance Sales    Risk
     Analyst  Modifier  Adapt.  Validator Forecast Simulator
        │        │        │        │        │        │
        └────────┴────────┴────────┴────────┴────────┘
                              │
                              ▼
                    Geo-Intelligence
                              │
                              ▼
                 Business Growth Optimizer
                              │
                              ▼
                 Expansion Playbook Generator
                              │
                              ▼
                  PostgreSQL + Object Storage
```

### Important execution relationship

Geo-Intelligence and Cultural Analyst can operate independently once their required inputs are available.

After Creative Modifier and Visual Adaptation produce the necessary outputs:

- Compliance Validator
- Sales Forecaster
- Risk Simulator

can run in parallel because they do not need to wait for one another.

Business Growth Optimizer runs after the required preceding outputs are available.

---

# 7. AGENT PIPELINE

The seven-agent pipeline is:

1. Cultural Analyst
2. Geo-Intelligence
3. Creative Modifier
4. Visual Adaptation
5. Compliance Validator
6. Sales Forecaster
7. Risk Simulator
8. Business Growth Optimizer

> The project documentation describes the pipeline as a seven-agent system while also listing the Sales Forecaster and Risk Simulator separately. For implementation, treat the named functional modules above as the explicit agent responsibilities, with orchestration capable of running the downstream analytical modules in parallel.

## Recommended logical flow

```text
Product Intake
      │
      ├──────────────► Cultural Analyst
      │
      └──────────────► Geo-Intelligence
                              │
Cultural Analyst ─────────────┘
      │
      ▼
Creative Modifier
      │
      ▼
Visual Adaptation
      │
      ├────────► Compliance Validator
      ├────────► Sales Forecaster
      └────────► Risk Simulator
                        │
                        ▼
              Business Growth Optimizer
                        │
                        ▼
              Expansion Playbook
```

---

# 8. RAP AGENT ARCHITECTURE

## 8.1 RAP lifecycle

The supplied RAP document defines:

**Plan → Reason ⇄ Act → Finalize**

### Plan
The agent creates a short explicit plan of what it needs to investigate.

### Reason
The agent examines what it knows, what is missing and what action should happen next.

### Act
The agent calls a deterministic tool such as:

- Curated dataset
- Web search
- Places API
- Weather API
- Image-generation API
- Another structured agent output

### Loop
Reason and Act repeat until the plan is satisfied or the hard step limit is reached.

### Finalize
The agent converts gathered information into the exact output schema required by downstream agents.

## 8.2 Why RAP fits Prodapt

RAP is useful because:

- Prodapt agents solve compound tasks rather than single fact lookups.
- Explicit planning reduces random tool use.
- Autonomous mode requires rationale and confidence.
- Structured agent hand-offs require schema stability.
- A bounded loop avoids uncontrolled agent execution and cost.

## 8.3 Hard step limit

The example Cultural Analyst implementation uses:

```python
MAX_STEPS = 6
```

Every production agent should have an explicit maximum iteration/tool-action budget.

Never allow an autonomous agent to loop indefinitely.

---

# 9. AGENT CONTRACT TEMPLATE

Every agent should have:

```text
Input
  ↓
Plan
  ↓
Reason
  ↓
Act / Tool
  ↓
Reason
  ↓
Act / Tool
  ↓
...
  ↓
Finalize
  ↓
Schema validation
  ↓
Persist output
  ↓
Pass to next agent
```

Every output should include, where applicable:

```json
{
  "confidence": "high | medium | low",
  "rationale": "why the conclusion was reached",
  "assumptions": [
    {
      "field": "string",
      "assumption": "string",
      "confidence": "high | medium | low"
    }
  ],
  "data_sources_used": ["string"]
}
```

---

# 10. CULTURAL ANALYST AGENT

## Role

Infers:

- Demographics
- Cultural context
- Preferences
- Taboos
- Festivals
- Climate/contextual observations
- Confidence-scored assumptions

## Input schema

```json
{
  "product": {
    "name": "string",
    "category": "string",
    "description": "string"
  },
  "target_market": {
    "name": "string",
    "country": "string",
    "region_type": "state | country | city"
  }
}
```

## Output schema

```json
{
  "demographics_summary": "string",
  "cultural_notes": ["string"],
  "relevant_festivals": [
    {
      "name": "string",
      "timing": "string",
      "relevance_to_product": "string"
    }
  ],
  "preferences_and_taboos": ["string"],
  "confidence": "high | medium | low",
  "rationale": "string",
  "data_sources_used": ["string"],
  "assumptions": []
}
```

## Allowed tools

- Curated market dataset
- Web search for fallback/enrichment

Do not give this agent unnecessary tools such as image generation or pricing tools.

## Plan stage

Keep the plan to approximately 3–5 steps.

Example:

```json
[
  "Check curated demographic and festival data",
  "Identify festivals or seasonal periods relevant to the product",
  "Identify cultural preferences or taboos relevant to the product",
  "Use web search if curated data is insufficient"
]
```

## Reason stage

The agent chooses one action:

```text
call_tool: query_curated_dataset
call_tool: web_search
finalize
```

## Finalize requirements

The final answer must be generated using structured output/tool-use enforcement.

Confidence should reflect evidence quality:

- Curated, strongly supported data → higher confidence
- Web-derived/inferred information → lower confidence where appropriate
- Missing information requiring assumptions → explicitly marked

---

# 11. GEO-INTELLIGENCE AGENT

## Role

Maps:

- Competitor density
- Distribution/retail partner targets
- High-footfall activation zones
- Premium vs. mass-market opportunities

## Main principle

This is primarily a **live-tools agent**, not a historical RAG agent.

## Required data

- Business listings
- Coordinates
- Category
- Basic place metadata
- Location/POI density
- Demographic layer where available

## Output

Map-ready objects:

```json
{
  "geo_recommendations": [
    {
      "lat": 0.0,
      "lng": 0.0,
      "name": "string",
      "category": "competitor | distribution | footfall",
      "rationale": "string",
      "score": 0
    }
  ]
}
```

The output should be structured for direct rendering by the map UI.

---

# 12. CREATIVE MODIFIER AGENT

## Role

Creates a structured adaptation/design brief.

## Inputs

Primarily:

- Cultural Analyst output
- Product information
- Target market

It should reason over already-grounded cultural information rather than independently retrieving the same information.

## Output areas

- Color direction
- Imagery/motifs
- Layout
- Messaging/storyline
- Product feature changes
- Ingredient changes where applicable
- Packaging changes
- Category-specific recommendations
- Confidence
- Rationale
- Assumptions

Example:

```json
{
  "variant_id": "v1",
  "color_direction": "warm reds/gold, festival-associated palette",
  "imagery_notes": "regional visual direction based on grounded cultural context",
  "packaging_size_change": "smaller single-serve SKU recommended",
  "feature_changes": [],
  "confidence": "medium",
  "rationale": "Reasoning based on available market evidence",
  "assumptions": []
}
```

## Category-specific design

A poster, FMCG package, mobile app, menu and SaaS product should not all use the exact same adaptation schema.

Use:

```text
Shared base:
- color
- tone
- positioning
- imagery
- messaging

Category extension:
- packaging fields
- UI fields
- ingredient fields
- pricing fields
- feature fields
```

---

# 13. VISUAL ADAPTATION AGENT

## Role

Produces actual visual outputs from the Creative Modifier brief while maintaining brand identity.

## Required inputs

- Creative Modifier structured brief
- Brand assets
- Existing logo
- Existing packaging/poster/UI references where applicable

## Important requirement

Reference/conditioning-based image generation is required for meaningful on-brand output.

Text-only image generation is insufficient for the intended brand-preservation requirement.

## Output

The full build guide recommends:

- 3–5 variants

The MVP SDLC recommendation is:

- 3 variants

Therefore:

- **MVP:** 3 variants
- **Full implementation:** 3–5 variants

Each variant should retain:

- Variant ID
- Generation prompt/brief reference
- Generated asset URL
- Generation notes
- Source brief reference
- Compliance status later
- Forecast score later
- Risk flags later

## Failure behavior

Image generation must not automatically destroy the entire pipeline.

Fallback:

```text
Image generation fails
       ↓
Retry according to policy
       ↓
If still failed:
design-brief-only variant
       ↓
continue pipeline with a visible flagged gap
```

---

# 14. COMPLIANCE VALIDATOR AGENT

## Role

Checks:

- Regulatory compliance
- Cultural sensitivity
- Generated text
- Generated visual outputs

## Data

Use a scoped regulatory/cultural knowledge-base slice for the target market.

## Two validation paths

### Text validation
RAG-grounded reasoning over:

- Creative brief
- Regulatory documents
- Cultural-sensitivity guidance

### Visual validation
Image-capable model evaluates:

- Imagery
- Symbols
- Color associations
- Potentially problematic visual elements
- Other cultural/regulatory concerns

## Output

```json
{
  "compliance_status": "pass | flag",
  "flags": [
    {
      "item": "string",
      "concern": "string",
      "source": "string",
      "severity": "low | medium | high"
    }
  ],
  "regulatory_notes": [],
  "confidence": "high | medium | low",
  "rationale": "string"
}
```

A flag should explain the concern and identify the supporting source.

Do not output an unexplained:

```text
"non-compliant"
```

## Failure philosophy

The build guide favors **flag-with-warning** rather than silently excluding content.

Human judgment remains appropriate for judgment calls.

---

# 15. SALES FORECASTER AGENT

## Role

Estimates success probability/score for each product variant.

## Inputs

- Cultural fit
- Geo/competitor data
- Creative brief
- Compliance information
- Variant details
- Market/category signals

## Output

- Success probability/score
- Key growth drivers
- Benchmark notes
- Reasoning behind the score
- Confidence
- Assumptions

The forecast should be consistent: similar inputs should not produce arbitrary scoring differences.

---

# 16. RISK SIMULATOR AGENT

## Role

Identifies:

- Regulatory risk
- Cultural risk
- Market risk
- Economic/political risk
- Currency/import/export considerations where applicable

## Output

```json
{
  "risk_flags": [],
  "risk_level": "low | medium | high",
  "mitigation_notes": [],
  "confidence": "high | medium | low",
  "rationale": "string"
}
```

Where a risk derives from a Compliance Validator flag, link back to that flag rather than independently re-deriving the same issue.

---

# 17. BUSINESS GROWTH OPTIMIZER AGENT

## Role

Final business synthesis.

It consumes prior outputs and produces:

- Pricing guidance
- Marketing channels
- Launch timing
- Distribution strategy
- Business recommendations

## Important dependencies

### Launch timing
Must reference the Cultural Analyst's festival/seasonal information.

### Distribution
Must reference Geo-Intelligence recommendations directly.

Do not independently regenerate geographic recommendations.

## Inputs

- Cultural Analyst
- Geo-Intelligence
- Creative Modifier
- Visual Adaptation
- Compliance Validator
- Sales Forecaster
- Risk Simulator

---

# 18. AUTONOMOUS MODE

Autonomous mode is a cross-cutting capability, not an individual agent.

## Required user input

Only:

1. Product intake
2. Target market selection

## Default-assumption behavior

Agents should:

- Avoid unnecessary clarification questions
- Infer missing information using product category + market evidence
- Log the inference
- Attach confidence
- Continue execution

Example:

```text
Assumption:
Premium positioning inferred from current price point.

Confidence:
Medium.
```

## Assumption schema

```json
{
  "assumptions": [
    {
      "field": "positioning",
      "assumption": "premium",
      "confidence": "medium"
    }
  ]
}
```

## Post-completion editing

Users should be able to:

- Edit a variant
- Regenerate a visual
- Re-run a scoped agent

The orchestrator should re-run only the affected node where possible instead of restarting the whole pipeline.

---

# 19. KNOWLEDGE BASE / RAG ARCHITECTURE

## 19.1 Data categories

| Category | Sources/examples | Runtime strategy |
|---|---|---|
| Culture/demographics | Government census/statistics, market research, consumer behavior studies | RAG |
| Festivals/calendars | Tourism boards, cultural-affairs publications, curated calendars | RAG |
| Climate | Meteorological data/historical summaries | RAG + live weather when necessary |
| Regulations | Government regulatory portals | RAG/curated rules |
| Competitors | Industry reports + live places data | Hybrid |
| Trends/sentiment | Current web/social/search | Live tool |
| Market signals | Public market reports/trend sources | RAG + live enrichment |
| Economic/risk indicators | World Bank, IMF, public risk indexes | Structured/live data |

## 19.2 Ingestion process

Before embedding:

1. Remove navigation
2. Remove footers
3. Remove ads
4. Remove boilerplate
5. Convert documents to clean text/Markdown
6. Extract only relevant sections from large PDFs
7. Chunk at natural boundaries

## 19.3 Chunking

Target:

**300–500 words per chunk**

Prefer:

- Headings
- Paragraph boundaries
- Logical sections

Avoid arbitrary character-only splitting.

## 19.4 Metadata

Each chunk should include:

- Country
- State/region
- Product category
- Document type
- Source citation
- Other useful market identifiers

Example:

```json
{
  "country": "India",
  "region": "Tamil Nadu",
  "category": "FMCG",
  "document_type": "cultural",
  "source": "..."
}
```

Metadata filtering enables queries such as:

```text
India + Tamil Nadu + FMCG + regulatory
```

instead of searching the entire global database.

## 19.5 Re-ingestion

The knowledge base must be refreshable.

Design incremental ingestion for:

- New documents
- Changed documents
- Updated regulations
- Changed festival dates
- New market information

Do not rely on a one-time ingestion script.

## 19.6 RAG completion test

Before building dependent agents:

- Test at least 10 product + target-market retrieval queries
- Confirm results are relevant
- Confirm metadata scoping works
- Confirm sources are traceable

---

# 20. MAP-BASED INPUT

The input map should:

1. Display the map
2. Allow click/draw selection
3. Reverse-geocode selected location
4. Show selected location as a removable chip
5. Support multiple selected markets/regions
6. Submit selected locations to the backend

Preferred mapping library:

**Mapbox GL JS**

Alternative:

- Google Maps JavaScript API
- Leaflet + OpenStreetMap tiles

---

# 21. MAP-BASED OUTPUT

The output map should display:

- Competitor pins
- Distribution pins
- Footfall/activation pins

## Pin interaction

Clicking a pin should display:

- Location name
- Category
- Rationale
- Fit/footfall score
- Relevant action such as "Add to distribution plan"

## Filtering

Provide:

- Legend
- Category toggles
- Client-side filtering

Do not re-query the backend every time the user toggles a category.

---

# 22. EXPANSION PLAYBOOK

The final Expansion Playbook should combine:

1. Executive market summary
2. Cultural analysis
3. Target-market context
4. Geo recommendations
5. Creative adaptation brief
6. Visual variants
7. Compliance status/flags
8. Sales forecast
9. Risk analysis
10. Pricing recommendation
11. Marketing-channel recommendation
12. Launch timing
13. Distribution plan
14. Interactive map
15. Assumptions and confidence
16. Source information

## Variant-centric presentation

The user should be able to evaluate a single variant end-to-end:

```text
Variant
 ├── Visual
 ├── Adaptation reasoning
 ├── Compliance status
 ├── Forecast score
 ├── Risk flags
 └── Pricing/business recommendation
```

This is more actionable than placing all information in unrelated sections.

---

# 23. DATABASE MODEL

Recommended PostgreSQL + PostGIS core entities:

## products

```text
id
name
category
description
base_price
brand_asset_urls[]
created_at
updated_at
```

## target_markets

```text
id
product_id
geo_boundary / point
market_name
selection_type
```

## pipeline_jobs

```text
id
product_id
status
current_stage
started_at
completed_at
```

## agent_outputs

```text
id
job_id
agent_name
output_json
confidence
rationale
created_at
```

## variants

```text
id
job_id
variant_number
design_brief_json
rendered_asset_url
compliance_status
forecast_score
risk_flags[]
```

## playbooks

```text
id
job_id
final_document_url
map_config_json
created_at
```

## geo_recommendations

```text
id
job_id
lat
lng
category
score
rationale
```

PostGIS is recommended because Prodapt stores and queries:

- Points
- Polygons
- Boundaries
- Proximity relationships

---

# 24. API DESIGN

Representative API endpoints:

```http
POST   /api/products
POST   /api/products/{id}/markets
POST   /api/products/{id}/generate

GET    /api/jobs/{id}/status
GET    /api/jobs/{id}/playbook

PATCH  /api/variants/{id}

GET    /api/jobs/{id}/geo-recommendations
```

## Responsibilities

### POST /api/products
Creates product intake.

### POST /api/products/{id}/markets
Stores map-selected target market(s).

### POST /api/products/{id}/generate
Starts autonomous pipeline.

### GET /api/jobs/{id}/status
Provides stage/job progress.

### GET /api/jobs/{id}/playbook
Returns final completed playbook.

### PATCH /api/variants/{id}
Supports edit/regenerate workflows.

### GET /api/jobs/{id}/geo-recommendations
Returns map pins with category filtering.

---

# 25. DEFINITIVE TECHNOLOGY STACK

The supplied **Recommended Tool Stack PDF** provides the clearest final selection. The broader technology document provides alternatives.

## Primary stack

| Layer | Selected tool | Purpose |
|---|---|---|
| Frontend | React | Web application |
| Styling | Tailwind CSS | UI styling |
| UI components | shadcn/ui | Forms, cards, popovers |
| Mapping | Mapbox GL JS | Input/output maps |
| Backend | FastAPI + Python | API and AI backend |
| LLM | Claude / Anthropic API | All core reasoning agents |
| Orchestration | LangGraph | Agent workflow/state graph |
| Embeddings | Voyage AI voyage-3 | RAG embeddings |
| Vector DB | Chroma | Initial vector database |
| Vector DB scale option | Qdrant Cloud | Later migration if Chroma is outgrown |
| Web search | Tavily API | Live grounding/enrichment |
| Places | Google Places API | Competitors/locations |
| Weather | OpenWeatherMap API | Weather/climate enrichment |
| Image generation | Gemini (Nano Banana) image model | Visual Adaptation |
| Structured DB | PostgreSQL | Core application data |
| Geo DB | PostgreSQL + PostGIS | Spatial data |
| Object storage | Cloudflare R2 | Assets/generated files |
| Job queue | Celery + Redis | Background execution/scaling |
| Hosting | Railway | Initial deployment |
| Scale hosting | AWS | Later-scale option |

## Supporting tools

| Area | Tool |
|---|---|
| API validation | Pydantic |
| Frontend server state | React Query |
| UI state | Zustand or Context |
| Charts | Recharts |
| Realtime | Socket.IO / WebSocket or SSE |
| File upload | react-dropzone + direct object-storage upload |
| Image processing | Pillow |
| Prompt registry | Version-controlled YAML/JSON |
| Error tracking | Sentry |
| LLM observability | Langfuse or Helicone |
| Logging | Structured logging |
| E2E | Playwright |
| Backend tests | pytest |
| Frontend tests | Vitest + React Testing Library |
| Load tests | Locust |
| API schema testing | Pydantic + schemathesis |
| CI/CD | GitHub Actions |
| Containerization | Docker |
| Design | Figma |
| Architecture diagrams | Excalidraw / Lucidchart / draw.io |
| API documentation | Swagger/OpenAPI |
| Project tracking | Linear / Jira / GitHub Projects |
| Version control | Git + GitHub/GitLab |

---

# 26. TOOL-STACK RECONCILIATION

The supplied documents contain alternatives. They should not be treated as contradictions.

## LLM

Primary:

**Claude / Anthropic API**

Alternatives listed:

- OpenAI API
- Google Gemini API

The RAP implementation specifically demonstrates structured output/tool-use with Claude.

## Orchestration

Primary recommendation from the definitive PDF:

**LangGraph**

Supporting/background execution:

**Celery + Redis**

This gives a practical division:

```text
LangGraph
    ↓
Agent state graph / dependencies / retries / scoped reruns

Celery + Redis
    ↓
Background jobs / asynchronous execution / queueing
```

The SDLC document also lists a simpler custom DAG runner as an MVP alternative.

## Vector database

Primary initial choice:

**Chroma**

Scale alternative:

**Qdrant Cloud**

The broader stack guide also recommends a self-hosted/single-node prototype before moving to managed infrastructure.

## Embeddings

Primary:

**Voyage AI voyage-3**

Free/local fallback:

**sentence-transformers**

## Image generation

Definitive supplied PDF:

**Gemini (Nano Banana)**

General requirement remains:

- Reference/conditioning-capable generation
- Brand-asset conditioning

## Storage

Definitive PDF:

**Cloudflare R2**

Broader alternatives:

- AWS S3
- Google Cloud Storage
- Supabase Storage

## Hosting

Definitive PDF:

**Railway**

Broader MVP alternatives:

- Render
- Fly.io
- Vercel frontend + backend hosting combination

Scale target:

**AWS**

---

# 27. MINIMUM PROTOTYPE STACK

For the first working prototype:

1. React
2. Mapbox GL JS
3. FastAPI
4. Claude API
5. Chroma
6. sentence-transformers or Voyage AI
7. PostgreSQL
8. Basic curated JSON/DB dataset
9. Tavily
10. Google Places
11. One reference-capable image-generation API
12. Railway or equivalent MVP hosting

The supplied tool-stack document specifically identifies a free/local starting path using:

- Claude API
- Chroma
- sentence-transformers
- FastAPI
- React
- Mapbox

This can support early Knowledge Base and Cultural Analyst development before committing heavily to paid services.

---

# 28. SDLC MODEL

Recommended methodology:

**Agile / Scrum with a walking-skeleton first sprint**

Why:

- AI-agent behavior is uncertain.
- Prompts and logic require iteration.
- External APIs can behave unpredictably.
- An early end-to-end demo exposes integration problems sooner.
- Short sprints make adaptation easier.

Recommended cadence:

**1-week sprints**

MVP:

**6–8 sprints + hardening/demo sprint**

---

# 29. SDLC PHASES

## Phase 1 — Requirements & Feasibility

### Activities

- Define target user/persona
- Extract functional requirements
- Define non-functional requirements
- Validate technical feasibility
- Write PRD
- Prioritize using MoSCoW

### Non-functional requirements

- Pipeline latency
- Data privacy
- Explainability
- Scalability
- Concurrent report generation

### Feasibility spike

Test:

1. Structured creative-brief generation
2. Reference-conditioned image generation
3. Map provider capability
4. Culture/festival/regulation data availability

---

# 30. IMPLEMENTATION SPRINT PLAN

## Sprint 0 — Setup
**2–3 days**

- Repository
- CI skeleton
- Environment configuration
- Database migrations
- API key provisioning
- Base architecture

## Sprint 1 — Walking Skeleton

Build:

```text
Product intake
      ↓
Map input
      ↓
Stub agent
      ↓
Static playbook
      ↓
Map output
```

Goal:

Prove the complete request lifecycle before adding real intelligence.

## Sprint 2 — Location Intelligence + Geo

- Curated market data for 1–2 demo market pairs
- Geo-Intelligence Agent
- Real Places/OSM data
- Real output pins

## Sprint 3 — Cultural + Creative

- Cultural Analyst
- Creative Modifier
- Structured JSON
- Confidence/rationale
- Fixture-based tests

## Sprint 4 — Visual Adaptation

- Reference image generation
- Brand asset conditioning
- Retry/fallback
- Variant persistence

## Sprint 5 — Validation + Forecast + Risk

- Compliance Validator
- Sales Forecaster
- Risk Simulator
- Rule-based + LLM hybrid MVP approach

## Sprint 6 — Business Optimizer + Playbook

- Final synthesis
- Playbook
- Map integration
- PDF/branded export

## Sprint 7 — Autonomous Mode + Edit/Regenerate

- Assumptions
- Confidence
- Scoped reruns
- Variant editing
- Visual regeneration

## Sprint 8 — Hardening/Demo

- Load testing
- Error UI
- Map polish
- Demo seed data
- Demo script
- Reliability checks

---

# 31. ALTERNATIVE BUILD ORDER FOR AGENT-FIRST DEVELOPMENT

The detailed Build Guide recommends:

1. Define all agent contracts
2. Build Knowledge Base
3. Build/test Cultural Analyst
4. Build Product Intake + map input in parallel
5. Build Geo-Intelligence
6. Build Creative Modifier + Visual Adaptation
7. Build Compliance Validator
8. Build Sales Forecaster + Risk Simulator
9. Build Business Growth Optimizer
10. Standardize autonomous mode/confidence
11. Connect orchestration
12. Build map output + Expansion Playbook
13. Full-pipeline tests
14. Async jobs + caching at scale

A strong intermediate milestone is:

> One product + one target market → grounded cultural report + multiple on-brand visual variants.

This demonstrates the core adaptation concept before the complete business-analysis layer is finished.

---

# 32. AGENT DEVELOPMENT WORKFLOW

Build one agent completely before cloning the pattern.

## Step 1 — Contract

Define input/output schemas.

## Step 2 — Plan

3–5 investigation steps.

## Step 3 — Reason/Act

Hard-bounded loop.

## Step 4 — Finalize

Strict structured output.

## Step 5 — Validate

Schema validation.

## Step 6 — Unit test

Fixtures + fallback + step cap.

## Step 7 — Observe

Log:

- Input hash
- Plan
- Tool calls
- Loop iterations
- Latency
- Token usage
- Confidence
- Final output

## Step 8 — Integrate

Add as one node in orchestration.

---

# 33. CULTURAL ANALYST RAP EXAMPLE

```python
MAX_STEPS = 6

def run_cultural_analyst(product, target_market):
    plan = generate_plan(product, target_market)
    scratchpad = []

    for step_num in range(MAX_STEPS):
        decision = reason(plan, scratchpad)

        if decision["action"] == "finalize":
            break

        result = act(
            decision["action"],
            decision["tool_input"]
        )

        scratchpad.append({
            "step": step_num,
            "action": decision["action"],
            "reasoning": decision["reasoning"],
            "result": result
        })

    return finalize(
        plan,
        scratchpad,
        product,
        target_market
    )
```

The Act layer should remain deterministic where possible:

```python
def act(action, tool_input):
    if action == "call_tool: query_curated_dataset":
        return query_curated_dataset(tool_input)

    elif action == "call_tool: web_search":
        return web_search_tool(tool_input)

    raise ValueError(f"Unknown action: {action}")
```

This makes tools:

- Cheap
- Fast
- Mockable
- Unit-testable

---

# 34. STRUCTURED OUTPUT ENFORCEMENT

Do not depend on free-form LLM JSON.

Use:

- Claude tool use / structured output
- Pydantic
- JSON Schema

Pipeline:

```text
LLM response
    ↓
Structured schema enforcement
    ↓
Pydantic / JSON Schema validation
    ↓
If invalid → repair/retry
    ↓
Persist
    ↓
Pass downstream
```

This prevents one agent's malformed response from breaking downstream agents.

---

# 35. TESTING STRATEGY

## 35.1 Unit tests

Test:

- Input schemas
- Output schemas
- Default behavior
- Missing-data behavior
- Assumptions
- Confidence values
- Agent-specific logic

## 35.2 RAP tests

### Schema conformance
Use 3–5 fixed fixtures.

### Fallback behavior
Mock curated data as empty and ensure web search fallback works.

### Step-cap test
Force Reason never to finalize and confirm execution terminates.

### Regression/snapshot test
Save known outputs and periodically compare future outputs.

## 35.3 Integration tests

Run the full pipeline with mocked:

- LLM
- Map API
- Places API
- Image-generation API
- Weather API

This keeps CI deterministic.

## 35.4 Contract tests

Every agent hand-off should validate its schema.

## 35.5 Prompt regression tests

Maintain fixed:

```text
product + market
```

fixtures and compare outputs when:

- Prompt changes
- Model changes
- Tool changes

## 35.6 UI/E2E tests

Test:

- Map click
- Reverse geocoding
- Location chips
- Multi-select
- Pin filters
- Pin popups
- Variant display
- Playbook rendering
- Edit/regenerate flow

Use Playwright or Cypress.

## 35.7 Load tests

Test:

- Concurrent jobs
- Queue backpressure
- Timeouts
- Retries
- Partial failures

Use Locust or an equivalent load-testing tool.

## 35.8 Manual compliance review

For early demos and public output:

**Do not rely only on automated compliance validation.**

Manually review generated text and visuals for cultural sensitivity.

---

# 36. PIPELINE EVALUATION DIAGNOSTICS

| Symptom | Likely cause | Fix |
|---|---|---|
| Retrieval irrelevant/missing | Chunking, metadata, embedding | Fix ingestion/RAG |
| Retrieval correct but conclusion wrong | Prompt/schema | Fix agent |
| Guess marked high confidence | Weak autonomous instructions | Strengthen confidence/assumption logic |
| Downstream agent fails | Schema drift | Validate contracts |
| Image generation fails | Image API/model issue | Retry + fallback |
| Pipeline too slow | Sequential execution | Parallelize independent agents |
| Repeated location API costs | No cache | Cache location/geo results |

Create **10–15 realistic end-to-end test cases** covering multiple product/market combinations.

---

# 37. DEPLOYMENT ARCHITECTURE

## Initial deployment

```text
React Frontend
      ↓
FastAPI Backend
      ↓
LangGraph
      ↓
External APIs + PostgreSQL + Chroma + R2
```

For low-volume MVP:

- One backend job per intake is acceptable.
- Synchronous execution can be used initially.

As usage grows:

```text
User
 ↓
API
 ↓
Celery/Redis
 ↓
Background pipeline
 ↓
Job status
 ↓
Playbook ready
```

The user should not need to keep an HTTP request open for a multi-minute pipeline.

---

# 38. ENVIRONMENTS

Use:

```text
Local
  ↓
Staging
  ↓
Production
```

Each environment should have separate:

- API keys
- Database
- Storage configuration
- Environment variables

Use a staging database populated with stable demo fixtures.

---

# 39. CI/CD

Recommended:

**GitHub Actions**

Pipeline:

```text
Pull Request
    ↓
Lint
    ↓
Unit tests
    ↓
Schema/contract tests
    ↓
Build
    ↓
Merge to main
    ↓
Deploy staging
    ↓
Manual production promotion
```

---

# 40. OBSERVABILITY

Log every agent invocation.

Recommended fields:

```text
job_id
agent_name
input_hash
prompt_version
tool_calls
retrieval_queries
loop_iterations
latency
token_usage
estimated_cost
confidence
status
error
created_at
```

Use:

- Sentry for application errors
- Langfuse/Helicone for LLM observability
- Structured logs
- Better Stack / Datadog / Loki as log aggregation options

Monitor:

- LLM cost
- Image-generation cost
- Map/Places usage
- Latency
- Error rate
- Confidence distribution
- Pipeline completion rate

---

# 41. CACHING & COST CONTROL

Cache information that does not change frequently.

Good cache candidates:

- Location intelligence
- Geo results
- Some weather/climate information
- Stable market metadata

Avoid blindly caching highly volatile information such as current competitor pricing or live trends.

The supplied architecture recommends Redis as both:

- Job queue infrastructure
- Cache layer

---

# 42. SECURITY

## Secrets

Never commit:

- API keys
- Database passwords
- Cloud credentials
- JWT secrets
- LLM keys

Use:

- Environment variables
- Platform secret store
- Doppler
- AWS Secrets Manager
- GCP Secret Manager

## Brand assets

Use private object storage by default.

Recommended:

- Private buckets
- Presigned URLs
- Encryption at rest
- Controlled access

## Authentication

MVP options:

- Auth0
- Clerk
- Simple JWT

Do not build custom authentication from scratch unless there is a specific reason.

## API protection

Use:

- Authentication
- Authorization
- Rate limiting
- Input validation
- Schema validation
- Request size limits for uploads

## Dependency security

Use:

- Dependabot
- Snyk
- Bandit
- ESLint security plugins

---

# 43. DATA PRIVACY

Business/user data should follow:

- Data minimization
- Encryption in transit
- Encryption at rest
- Defined retention policy
- Controlled access

Uploaded brand assets and business information should not be exposed publicly by default.

---

# 44. FAILURE & RETRY STRATEGY

Every external dependency should have:

- Timeout
- Retry policy
- Error classification
- Fallback
- User-visible status where necessary

## Partial failure principle

One agent failure should not automatically destroy the entire playbook.

Example:

```text
Visual generation fails
        ↓
Retry
        ↓
Still fails
        ↓
Generate text/design brief
        ↓
Mark visual gap
        ↓
Continue compliance/forecast/business synthesis where possible
```

The exact blocking/non-blocking policy should be defined per agent.

---

# 45. SOURCE STRATEGY

## Cultural/demographic sources

- National statistics offices
- Census data
- World Bank Open Data
- Market research
- Consumer behavior studies

## Festivals

- Tourism boards
- Cultural affairs ministries
- Regional calendars
- Curated internal datasets

## Climate

- National meteorological departments
- OpenWeatherMap
- Visual Crossing

## Regulations

- Government regulatory portals
- Food/product safety authorities
- Trade/import/export portals
- Curated internal rules database

## Competitors

- Industry reports
- Trade associations
- Google Places
- OpenStreetMap Overpass
- Other places providers where appropriate

## Trends

- Search/trend APIs
- Current web search
- Public industry reports

## Economic/risk

- World Bank
- IMF
- Public risk indices

---

# 46. CURATED DATA STRATEGY FOR MVP

Do not attempt to build live scrapers for every data source during the initial build.

Instead:

```text
Curated JSON/DB
      +
Live web/tool enrichment
      ↓
Grounded agent output
```

Clearly distinguish:

- Live data
- Curated seed data
- Model inference
- Assumptions

This is important for:

- Technical credibility
- Demo credibility
- Future engineering handoff
- Confidence scoring

---

# 47. TEAM STRUCTURE

| Role | Responsibility |
|---|---|
| Product/PM | PRD, priorities, demo narrative |
| Frontend Engineer | Map UI, intake, playbook viewer |
| Backend Engineer | API, orchestration, DB |
| AI/ML Engineer | Agent prompts, schemas, image generation |
| Data Engineer | Curated market data, geo data |
| QA | Fixtures, regression, E2E |

For a 3–4 person hackathon team:

- Person 1 → Frontend/map
- Person 2 → Backend/orchestration
- Person 3 → Agents/prompts
- Person 4 → Data/AI/testing

Roles can overlap.

---

# 48. RISK REGISTER

| Risk | Mitigation |
|---|---|
| Image quality/consistency | Use reference conditioning; provide design-brief fallback |
| Thin curated data | Display confidence/coverage; do not overclaim real-time coverage |
| Schema drift | Structured outputs + validation + repair/retry |
| Cultural/compliance mistakes | Manual review for early public outputs |
| High latency | Parallelize independent agents; show incremental progress |
| API failure | Retries + fallbacks |
| Cost growth | Caching + token/image monitoring + rate limits |
| Agent loops | Hard step caps |
| Stale knowledge | Incremental re-ingestion |
| Large asset uploads | Direct-to-object-storage uploads |

---

# 49. OBSERVABILITY AND VERSIONING

Version independently:

- Agent prompts
- Agent schemas
- Tool versions
- Data sources
- Knowledge-base documents
- Embedding model
- LLM model
- Image model

A stored agent output should be traceable to:

```text
Job
 ↓
Agent
 ↓
Prompt version
 ↓
Model
 ↓
Tools
 ↓
Retrieved sources
 ↓
Final structured output
```

This is especially important when a later result needs debugging.

---

# 50. PROJECT REPOSITORY STRUCTURE

A recommended logical structure:

```text
prodapt/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── maps/
│   │   ├── playbook/
│   │   └── state/
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── agents/
│   │   │   ├── cultural/
│   │   │   ├── geo/
│   │   │   ├── creative/
│   │   │   ├── visual/
│   │   │   ├── compliance/
│   │   │   ├── sales/
│   │   │   ├── risk/
│   │   │   └── growth/
│   │   ├── orchestration/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── tools/
│   │   ├── rag/
│   │   ├── storage/
│   │   └── services/
│   └── tests/
│
├── prompts/
│   ├── cultural/
│   ├── creative/
│   ├── compliance/
│   ├── sales/
│   ├── risk/
│   └── growth/
│
├── data/
│   ├── seed/
│   ├── festivals/
│   ├── regulations/
│   ├── demographics/
│   └── markets/
│
├── docs/
│
├── infrastructure/
│
├── .github/
│   └── workflows/
│
└── README.md
```

This is an implementation-oriented organization derived from the separation of concerns described in the supplied architecture documents.

---

# 51. MVP DEFINITION OF DONE

Prodapt MVP should be considered functionally complete when:

## Intake
- Product can be submitted
- Brand assets can be uploaded
- Target market can be selected

## Knowledge
- Demo market data exists
- Retrieval is scoped and source-aware

## Agents
- Required agent contracts exist
- Structured output works
- Confidence/rationale/assumptions work
- Fallback behavior works

## Pipeline
- Full pipeline can execute
- Parallel agents run correctly
- Intermediate outputs are persisted
- Partial failures are handled

## Visuals
- At least 3 variants can be generated
- Brand references are used
- Failed generation has fallback behavior

## Geo
- Output pins render
- Categories can be filtered
- Pin cards show rationale/score

## Playbook
- Final playbook contains all major outputs
- Variant-centric view works
- Export is available

## Quality
- Unit tests
- Contract tests
- Integration tests
- E2E tests
- Prompt regression fixtures

## Operations
- Logging
- Error tracking
- Secret management
- CI/CD
- Basic cost monitoring

---

# 52. FULL BUILD CHECKLIST

## Foundations
- [ ] Define all agent contracts
- [ ] Define schemas
- [ ] Define assumptions/confidence
- [ ] Define data classes
- [ ] Define frontend/backend boundary

## RAG
- [ ] Collect sources
- [ ] Clean documents
- [ ] Chunk
- [ ] Add metadata
- [ ] Embed
- [ ] Store
- [ ] Build scoped retrieval
- [ ] Build incremental ingestion
- [ ] Test 10+ retrieval queries

## Cultural
- [ ] Plan
- [ ] Reason
- [ ] Act
- [ ] Finalize
- [ ] Schema validation
- [ ] Fallback
- [ ] Regression fixtures

## Geo
- [ ] Places integration
- [ ] Geocoding
- [ ] Competitor density
- [ ] Distribution targets
- [ ] Footfall heuristic
- [ ] Scored map pins

## Creative
- [ ] Cultural input
- [ ] Shared schema
- [ ] Category extensions
- [ ] Confidence
- [ ] Assumptions

## Visual
- [ ] Brand upload
- [ ] Reference conditioning
- [ ] 3 MVP variants
- [ ] 3–5 full variants
- [ ] Retry
- [ ] Fallback
- [ ] Asset persistence

## Compliance
- [ ] Regulatory retrieval
- [ ] Cultural validation
- [ ] Text validation
- [ ] Image validation
- [ ] Flag explanations
- [ ] Source references

## Forecast/Risk
- [ ] Forecast score
- [ ] Growth drivers
- [ ] Risk flags
- [ ] Risk severity
- [ ] Mitigation

## Business
- [ ] Pricing
- [ ] Marketing
- [ ] Timing
- [ ] Distribution
- [ ] Festival linkage
- [ ] Geo linkage

## Autonomous mode
- [ ] No unnecessary clarification questions
- [ ] Assumption schema
- [ ] Confidence
- [ ] Rationale
- [ ] Scoped rerun

## Orchestration
- [ ] Sequential dependencies
- [ ] Parallel execution
- [ ] Retry
- [ ] Timeout
- [ ] Partial failure
- [ ] Intermediate persistence
- [ ] Tool-call logging

## Frontend
- [ ] Product intake
- [ ] Asset upload
- [ ] Map selection
- [ ] Progress display
- [ ] Playbook viewer
- [ ] Variant viewer
- [ ] Output map
- [ ] Pin filters
- [ ] Edit/regenerate

## Testing
- [ ] Unit
- [ ] Contract
- [ ] Integration
- [ ] Prompt regression
- [ ] E2E
- [ ] Load
- [ ] Manual compliance review

## Deployment
- [ ] Docker
- [ ] CI/CD
- [ ] Local/staging/prod
- [ ] Secrets
- [ ] Logging
- [ ] Sentry
- [ ] LLM observability
- [ ] Cost monitoring
- [ ] Backups

---

# 53. IMMEDIATE EXECUTION PLAN

If starting development now, use this order:

### Step 1
Write the PRD and freeze MVP scope.

### Step 2
Create the repository and environment configuration.

### Step 3
Define all agent contracts before writing agent prompts.

### Step 4
Build the walking skeleton:

```text
React
  ↓
FastAPI
  ↓
Job
  ↓
Stub agent
  ↓
Playbook
  ↓
Map
```

### Step 5
Build the curated market knowledge base.

### Step 6
Implement Cultural Analyst using RAP.

### Step 7
Fully test Cultural Analyst in isolation.

### Step 8
Implement Geo-Intelligence.

### Step 9
Implement Creative Modifier.

### Step 10
Implement Visual Adaptation.

### Step 11
Implement Compliance, Sales and Risk modules in parallel-capable form.

### Step 12
Implement Business Growth Optimizer.

### Step 13
Implement LangGraph orchestration and scoped reruns.

### Step 14
Implement autonomous assumptions/confidence across every agent.

### Step 15
Assemble the Expansion Playbook.

### Step 16
Complete E2E tests.

### Step 17
Deploy MVP.

### Step 18
Add Celery/Redis async execution and caching when real usage requires it.

---

# 54. POST-MVP ROADMAP

After MVP:

1. Expand market coverage.
2. Expand product-category coverage.
3. Improve curated datasets.
4. Add human review.
5. Improve visual fidelity.
6. Add feedback loop from user-selected variants.
7. Tune Sales Forecaster using actual user actions.
8. Add multi-tenant architecture.
9. Add billing and usage metering.
10. Move infrastructure to AWS/GCP when scale justifies it.
11. Introduce managed vector database when needed.
12. Add advanced commercial/footfall datasets.

---

# 55. FINAL ARCHITECTURAL PRINCIPLES

1. **Contracts first.**
2. **Separate RAG, live tools and pure reasoning.**
3. **Use structured outputs, not free-form agent hand-offs.**
4. **Every assumption must be visible and confidence-scored.**
5. **Every agent should be independently testable.**
6. **Use RAP with hard step limits.**
7. **Keep Act/tool calls deterministic where possible.**
8. **Persist intermediate outputs.**
9. **Support partial failure.**
10. **Parallelize independent agents.**
11. **Keep live data live; do not embed volatile information unnecessarily.**
12. **Use curated seed data for the MVP rather than attempting to scrape everything.**
13. **Keep brand assets private by default.**
14. **Log every important agent/tool/retrieval operation.**
15. **Build the walking skeleton before deep intelligence.**
16. **Treat the Expansion Playbook as the final user-facing product, not just an agent response.**
17. **Design scoped regeneration from the beginning.**
18. **Do not over-engineer infrastructure before actual scale requires it.**

---

# 56. SOURCE TRACEABILITY

This master document consolidates the supplied sources as follows:

| Source | Main information incorporated |
|---|---|
| `Prodapt_Build_Guide.md` | Complete agent pipeline, RAG design, autonomous mode, orchestration, map output, playbook, testing, deployment, roadmap, data sources |
| `Prodapt_Building_an_Agent_with_RAP_Model.md` | RAP architecture, Cultural Analyst contract, Plan/Reason/Act/Finalize flow, structured output, testing, agent reuse |
| `Prodapt_SDLC_Development_Guide.md` | Agile/Scrum model, MVP scope, architecture, database/API design, sprints, testing, deployment, team roles, risks |
| `Prodapt_Technology_and_Tools_Stack.md` | Detailed frontend/backend/AI/image/map/data/database/DevOps/observability/testing/security/tool alternatives |
| `Prodapt_Tool_Stack.pdf` | Definitive primary tool selection: Claude, LangGraph, Voyage AI, Chroma, Tavily, Google Places, OpenWeatherMap, Gemini, FastAPI, PostgreSQL, Cloudflare R2, Celery/Redis, React, Mapbox, Railway |

---

# 57. ONE-PAGE SYSTEM SUMMARY

```text
                         PRODAPT
                           │
             Product + Brand Assets + Target Market
                           │
                           ▼
                  ┌─────────────────┐
                  │   RAG / DATA    │
                  │ curated + live  │
                  └────────┬────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      Cultural Analyst            Geo-Intelligence
             │                           │
             └─────────────┬─────────────┘
                           ▼
                  Creative Modifier
                           │
                           ▼
                  Visual Adaptation
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
       Compliance        Sales           Risk
       Validator       Forecaster      Simulator
            └──────────────┼──────────────┘
                           ▼
                 Business Growth
                    Optimizer
                           │
                           ▼
                Expansion Playbook
                 ├── Insights
                 ├── Variants
                 ├── Compliance
                 ├── Forecast
                 ├── Risks
                 ├── Pricing
                 ├── Marketing
                 ├── Timing
                 ├── Distribution
                 └── Interactive Map
```

**Primary architecture:** React + Mapbox → FastAPI → LangGraph → Claude + RAG/live tools → PostgreSQL/PostGIS + Chroma + Cloudflare R2, with Celery/Redis for background execution and Railway for initial hosting.

**Core execution model:** Plan → Reason ⇄ Act → Finalize → Validate → Persist → Next Agent.

**Core product promise:** Turn a product and target market into a grounded, culturally adapted, visually generated, compliance-aware and commercially actionable market-expansion plan.
