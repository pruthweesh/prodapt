# Prodapt

**Intelligent Product Adaptation, Launch-Location Recommendation & Multi-Market Expansion Platform**

Prodapt is an AI/ML platform built on **LLM agents and Retrieval-Augmented Generation (RAG)**. A business uploads its product details. Prodapt **analyzes the product, recommends the best locations to launch it, and tells the business exactly what to modify in the product for each location to improve its chances of selling**. Everything is packaged into an Expansion Playbook with rendered visuals, per-channel pricing, marketing, distribution, and launch timing.

Prodapt does not stop at insights. It produces the recommended locations, the adapted product variants, and the launch plan.

> **Status:** this document accompanies a final-year / hackathon project proposal. The design below is the planned system. Implementation details (models, APIs, data sources) will be documented as development progresses.
>
> **About this document:** this is the single consolidated reference for the project. It merges the 21-section README, the Master Project Document, and the earlier guides (Build Guide, SDLC Guide, RAP agent guide, Technology & Tools Stack, IEEE prior-art check). Where earlier documents conflicted, this one follows the most recent and most detailed source.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Worked Example Used Throughout](#2-worked-example-used-throughout)
3. [Key Features at a Glance](#3-key-features-at-a-glance)
4. [Product Intake](#4-product-intake)
5. [Features Explained in Detail](#5-features-explained-in-detail)
6. [System Architecture](#6-system-architecture)
7. [The Ten Agents](#7-the-ten-agents)
8. [Knowledge and Data Layer (RAG)](#8-knowledge-and-data-layer-rag)
9. [The RAP Agent Pattern](#9-the-rap-agent-pattern)
10. [Scoring, Confidence and Autonomous Mode](#10-scoring-confidence-and-autonomous-mode)
11. [Map-Based Interaction](#11-map-based-interaction)
12. [The Expansion Playbook](#12-the-expansion-playbook)
13. [Scope: What Prodapt Can Adapt](#13-scope-what-prodapt-can-adapt)
14. [Data Model and API](#14-data-model-and-api)
15. [Technology Stack and Build Path](#15-technology-stack-and-build-path)
16. [SDLC, MVP Scope and Roadmap](#16-sdlc-mvp-scope-and-roadmap)
17. [Evaluation Plan](#17-evaluation-plan)
18. [Responsible Use, Limitations and Risks](#18-responsible-use-limitations-and-risks)
19. [Prior Art Check (IEEE)](#19-prior-art-check-ieee)
20. [Users, Market and Business Model](#20-users-market-and-business-model)
21. [AI/ML Domain Mapping](#21-aiml-domain-mapping)
22. [Glossary and FAQ](#22-glossary-and-faq)
23. [UI Design Reference](#23-ui-design-reference)
24. [Documentation Index, Team, License](#24-documentation-index-team-license)

---

## 1. Overview

### 1.1 The problem

Businesses succeed locally because owners understand their home market: its tastes, festivals, price sensitivity, and rules. When they try to expand to a new city, state, or country, that knowledge no longer applies. Expansion fails for predictable reasons:

- The product doesn't match local taste, culture, climate, or budget.
- Packaging, language, colors, or symbols send the wrong message.
- Local regulations (labelling, import rules, advertising standards) are missed.
- The business picks the wrong place to launch, or launches at the wrong time.
- There is no real-time, local intelligence, only guesswork.

Today, businesses handle this with market research reports, surveys, or consultants. These methods are slow, expensive, and often based on assumptions rather than data. Small businesses usually cannot afford them at all. Existing AI tools mostly produce text insights, not usable product changes, and no tool combines culture, compliance, and success-case analysis in one flow.

### 1.2 The two-pillar core offering

Everything Prodapt does supports two primary outputs.

**Pillar 1: Location suggestion.** *"Where should this launch?"* Prodapt ranks candidate markets with an explainable fit score, evidence, and reasoning, so the business doesn't need to already know its target market.

**Pillar 2: Modification ideas, per location.** *"What should change about it, and where?"* This covers three levels of change:

| Change type | Example |
|---|---|
| Functionality / feature | Monetization model swap, ingredient or formulation change, onboarding flow change |
| Style / surface | Color palette, imagery, packaging layout, poster art, UI visual direction |
| Commercial | Price band **per sales channel** (see Feature 12), pack size, positioning message |

**One-sentence pitch:** *Given any product, Prodapt tells you which locations to launch in and exactly what to change about the product for each one, with everything else in the system existing to make those two answers evidence-backed, visual, and compliant.*

Every other agent (Cultural Analyst, Geo-Intelligence, Visual Adaptation, Compliance Validator, Risk Simulator, Business Growth Optimizer) is a **supporting service** to these two pillars, not a third core function.

### 1.3 The solution

Prodapt acts as an autonomous **Product Evolution Engine**:

1. **Understands the product.** It converts the uploaded product information into a structured profile.
2. **Finds the right places.** It ranks the best locations to launch, with reasons and evidence.
3. **Adapts the product per location.** It recommends specific modifications to packaging, pricing, size, ingredients, design, or features.
4. **Learns from what already works.** It retrieves similar products that succeeded in each location and shows what they did differently.
5. **Checks safety.** It flags regulatory, cultural, and market risks before launch.
6. **Delivers a plan.** It produces an Expansion Playbook with visuals, per-channel pricing, marketing, distribution, and timing.

### 1.4 What makes Prodapt different

| Typical approach | Prodapt |
|---|---|
| Business must already know where to expand | Prodapt recommends where to launch, based on the product |
| Reports describe the market and stop | Prodapt outputs adapted product variants and rendered visuals |
| Sales predictions with no verifiable basis | Recommendations grounded in similar successful products, with cited sources |
| Culture, compliance, and success analysis are separate exercises | All three run in one pipeline |
| Text-based location entry and text lists of places | Click-on-map input and pin-based output |
| Advice with no visible reasoning | Every decision carries a rationale, evidence, and a confidence level |
| One flat price per city or market | A **per-channel price matrix** (retail, modern trade, cinema, hotel, online, bulk), every price tied to a cited real comparable |
| Tools that keep asking questions | Autonomous mode: minimal input, assumptions stated openly |

---

## 2. Worked Example Used Throughout

To keep the explanations concrete, the rest of this document uses one example.

**Scenario:** A small company in Chennai makes a **ragi (finger millet) biscuit**, priced at **₹10 for a 50g pack**, sold in general stores in Tamil Nadu. The owner wants to expand but doesn't know where, or what to change.

**What the user provides:** product type (hard product), name, category (biscuits), price, pack size, ingredients, a short description, and photos of the current pack.

**What Prodapt returns (illustrative):**

| Step | Output |
|---|---|
| Product profile | Snack biscuit, low-price mass market, health-positioned (millet), 50g single-serve, family-oriented |
| Ranked locations | 1. Karnataka (fit 0.82), 2. Kerala (0.76), 3. Telangana (0.71) |
| Why Karnataka | Strong millet awareness, price-sensitive general-store channel, moderate competition in the mid-price biscuit band |
| Similar successful products | Three millet-based snack products that sell well in Karnataka, with their price, pack size, and label language |
| Recommended modifications | Kannada labelling, a 30g trial pack at a lower price, a jaggery flavor variant, festival gift pack |
| Compliance flags | Nutrition-label format and claim wording need review under Indian food labelling rules |
| Channel pricing | A per-channel price matrix (for example general retail vs. modern trade vs. convenience/captive vs. online), each price backed by a cited comparable or flagged `confidence: low` |
| Launch timing | Start before a major regional festival, with a gift-pack SKU |
| Distribution pins | Map showing high-footfall zones and retail partner targets in Bengaluru and Mysuru |

Every value above is illustrative. Real outputs depend on the data available for each market.

---

## 3. Key Features at a Glance

| # | Feature | One-line summary |
|---|---|---|
| 1 | Product analysis | Turns raw product information into a structured profile |
| 2 | Launch-location recommendation | Ranks the best cities, states, or countries to launch in (Pillar 1) |
| 3 | Location-specific product modifications | Suggests concrete changes per location to improve sales prospects (Pillar 2) |
| 4 | Success-analog reasoning (case-based RAG) | Learns from similar products that succeeded in the target market |
| 5 | Cultural and market intelligence | Studies demographics, culture, festivals, climate, regulations, competitors |
| 6 | Retrieval-grounded answers with citations | Every claim is backed by retrieved sources |
| 7 | Visual adaptation | Renders on-brand packaging, posters, or screens for each variant |
| 8 | Compliance and cultural-sensitivity checks | Flags issues in text and visuals, with sources |
| 9 | Risk simulation | Lists regulatory, cultural, and market risks with severity |
| 10 | Map-based interaction (in and out) | Click to select markets, see recommendations as pins |
| 11 | Business growth strategy | Marketing, distribution, and festival-aligned launch timing |
| 12 | Channel pricing and launch strategy | One price per sales channel per location, each tied to a cited comparable |
| 13 | Autonomous mode with confidence scores | Runs with minimal input; assumptions are stated and scored |
| 14 | Explainability | Rationale, evidence, and confidence on every decision |
| 15 | Expansion Playbook | One deliverable with everything, including an interactive map |

---

## 4. Product Intake

### 4.1 Product-type-aware intake

The intake form opens with a **product type selector**, which changes what is required, especially images, because "any hard, soft, or idea product" needs different handling.

| Product type | Covers | Required data | Image / asset collection |
|---|---|---|---|
| **Hard** (physical) | FMCG, food, fashion, consumer goods | Name, category, description, price, size/format, ingredients/materials, current markets | **Required, multi-angle:** front, back, top, bottom, left, right, label close-up, packaging-open shot |
| **Soft** (digital) | Apps, SaaS, games, digital services | Name, category, description, pricing model, core feature list, target platform | **Optional:** key screenshots (onboarding, main screens, pricing page) |
| **Idea** (pre-product) | Not-yet-built concepts being validated | Name/concept, category, description, intended price point, intended feature set | **None by definition:** text-only |
| **Other** | Media, events, real estate, etc. (full scope in Section 13) | Category-appropriate description fields | **Optional**, same pattern as Soft |

**Why this matters beyond the form:**

- **Confidence is tied to completeness.** Full multi-angle images give real visual grounding for the Compliance Validator and Visual Adaptation Agent, which raises confidence. Idea-stage input has zero visual grounding, so the Profiler logs lower confidence on anything visual or design-related.
- **Multimodal reading triggers only when images exist.** It is skipped cleanly for Idea-stage submissions and is not treated as a failure.
- **Missing images never block the pipeline.** Hard-product images are collected as a required set in the form, but if some angles are unavailable the pipeline still runs (consistent with autonomous mode, Feature 13): visual confidence drops and the gaps are logged as assumptions.
- **The Visual Adaptation Agent's job changes by type.** Hard: true brand-conditioned generation from real photos. Soft: conditioned on screenshots if given, otherwise generated from the feature brief alone. Idea: labelled in the Playbook as a **"concept visualization"**, never implied to be a rendering of something real.

### 4.2 Intake schema

```json
{
  "product_type": "hard | soft | idea",
  "name": "string",
  "category": "string",
  "description": "string",
  "price": {"amount": "number", "currency": "INR"},
  "current_markets": ["string"],

  "hard_product_details": {
    "pack_size_or_dimensions": "string",
    "ingredients_or_materials": ["string"],
    "images": {
      "front": "url", "back": "url", "top": "url",
      "bottom": "url", "left": "url", "right": "url",
      "label_closeup": "url", "packaging_open": "url"
    }
  },
  "soft_product_details": {
    "pricing_model": "string",
    "core_features": ["string"],
    "target_platform": "string",
    "screenshots": ["url"]
  },
  "idea_product_details": {
    "intended_price_point": "string",
    "intended_features": ["string"]
  },

  "target_markets": ["optional, map-selected locations"]
}
```

`price` may be `null` for idea-stage products that have no price yet; the Product Profiler then infers a price band and logs it as an assumption.

### 4.3 Map-based target market selection (optional at intake)

- The user clicks or draws on an embedded map to select markets. **This is optional**; if skipped, the Location Recommender proposes locations.
- Multiple locations can be selected in one action.
- A search-to-locate control helps with large or unfamiliar geographies.
- Each click is confirmed as a removable tagged chip, with the place name auto-filled through reverse geocoding (this removes ambiguity between similarly named places).

Full details are in Section 11.

---

## 5. Features Explained in Detail

Each feature below covers what it is, why it matters, how it works, its inputs and outputs, an example, and its limits.

### Feature 1: Product analysis

**What it is.** The system reads everything the user provides about the product and converts it into a structured **product profile** that all other agents use. This is done by the **Product Profiler** agent.

**Why it matters.** Every later decision (where to launch, what to change, what to charge) depends on a correct understanding of the product. A structured profile also lets the system compare the product with others, which is what makes the success-analog feature possible.

**How it works.**
1. The user submits product details (Section 4): product type, name, category, description, price, size, ingredients or features, current markets, and optionally brand assets (logo, packaging photos, UI screenshots).
2. The agent branches by `product_type`, then extracts and normalizes the attributes: category and sub-category, price band, size, key claims, target customer, brand positioning, and existing strengths.
3. For anything missing, it infers a reasonable value from the category and records it as an **assumption with a confidence level** (see Feature 13).
4. If images are provided, a multimodal model describes the visual identity (colors, layout, language on pack) so later agents know what "on-brand" means. For Idea-stage products this step is skipped.

**Input → output.**

```json
{
  "input": {
    "product_type": "hard",
    "name": "Ragi Crunch Biscuit",
    "category": "Biscuits",
    "description": "Millet-based biscuit for everyday snacking",
    "price": {"amount": 10, "currency": "INR"},
    "pack_size": "50g",
    "current_market": "Tamil Nadu",
    "brand_assets": ["pack_front.png", "logo.svg"]
  },
  "output_profile": {
    "category": "Packaged snacks > Biscuits",
    "price_band": "low / mass market",
    "pack_size_class": "single-serve",
    "key_attributes": ["millet-based", "health-positioned", "tamil labelling"],
    "target_customer": "families, school-age children, health-conscious adults",
    "visual_identity": {"colors": ["green", "cream"], "language_on_pack": ["Tamil", "English"]},
    "assumptions": [
      {"field": "positioning", "assumption": "mass market", "confidence": "medium"}
    ]
  }
}
```

**Limits.** The profile is only as good as the input. Sparse input produces more assumptions and lower confidence, which is shown to the user.

---

### Feature 2: Launch-location recommendation (Pillar 1)

**What it is.** Prodapt ranks the **best places to launch** the product (cities, states, or countries) instead of requiring the user to already know. The **Location Recommender** agent does this.

**Why it matters.** Choosing the wrong market is the most expensive expansion mistake. Small businesses rarely have the research capacity to compare many options. This feature turns that comparison into an automatic, explainable ranking.

**How it works.**
1. **Candidate generation.** If the user selected regions on the map, those are the candidates. If not, the agent starts from a default candidate list (for example, neighbouring states for an Indian MSME, or a shortlist of countries for an exporter).
2. **Evidence retrieval.** For each candidate, the agent retrieves from the knowledge bases (culture, demographics, consumption patterns, regulations) and pulls similar successful products from the success-case knowledge base. Live tools add current signals such as search-interest trends and competitor presence.
3. **Scoring.** Each candidate gets a fit score built from explainable components: category demand, cultural and demographic fit, price fit, competition gap, regulatory ease, and seasonal or climate fit (see Section 10.1).
4. **Ranking and explanation.** Candidates are sorted, and each gets a written reason, its evidence, top modifications, and a confidence level.
5. **Optional user override.** The user can confirm, add, or remove locations on the map. The pipeline then continues only for the chosen locations.

**Output (per location).**

```json
{
  "location": "Karnataka",
  "rank": 1,
  "fit_score": 0.82,
  "score_breakdown": {
    "category_demand": 0.88,
    "cultural_fit": 0.80,
    "price_fit": 0.78,
    "competition_gap": 0.75,
    "regulatory_ease": 0.90,
    "seasonal_fit": 0.70
  },
  "why_it_fits": "Millet awareness is high; mid-price biscuit band has moderate competition",
  "evidence": ["analog: <product name>", "source: <consumption dataset>"],
  "top_modifications": ["Kannada labelling", "30g trial pack"],
  "confidence": "medium"
}
```

(The breakdown above reproduces the fit score using the example weights in Section 10.1: 0.30×0.88 + 0.25×0.80 + 0.15×0.78 + 0.15×0.75 + 0.10×0.90 + 0.05×0.70 ≈ 0.82.)

**Limits.** Rankings depend on the coverage of the data. In markets with thin data, confidence is lowered and the playbook says so.

---

### Feature 3: Location-specific product modifications (Pillar 2)

**What it is.** For every recommended location, Prodapt states **what to change in the product** to fit it, and why. This is the core of "adapting" rather than just "analyzing."

**Why it matters.** Knowing that a market is promising is not enough. The business needs to know what to actually do differently: what to print on the pack, what size to sell, at what price, with which flavor.

**What can be modified.**

| Area | Examples |
|---|---|
| Packaging and design | Language on pack, color palette, imagery, symbols, layout, festival editions |
| Product substance | Flavor, ingredients, features, recipe, formulation |
| Size and format | Pack size, single-serve vs. family pack, gift pack |
| Commercial | Price band per channel, promotional pricing, positioning message |
| Content (for media, apps, etc.) | Title, tagline, poster, onboarding tone, payment methods |

**How it works.** Modifications come from two sources that are combined:
- The **Success-Analog Advisor** provides *evidence-based* changes: what similar successful products in that location did differently.
- The **Cultural Analyst** and **Creative Modifier** provide *context-based* changes: what the culture, climate, and festivals suggest.

Each suggested change is a structured record: what to change, the reason, the evidence, the expected effect, and a confidence level.

**Example.**

```json
{
  "change": "Introduce a 30g trial pack at a lower price point",
  "reason": "Successful analogs in this market sell in smaller, lower-priced packs",
  "supported_by": ["Analog A", "Analog B"],
  "expected_effect": "Lower trial barrier; better fit with general-store buying habits",
  "confidence": "medium"
}
```

**Limits.** These are recommendations to test, not guaranteed outcomes.

---

### Feature 4: Success-analog reasoning (case-based RAG)

**What it is.** Instead of predicting a sales number, Prodapt **finds similar products that succeeded in the target market and learns what they did differently**. This is done by the **Success-Analog Advisor**, and it replaces the earlier "Sales Forecaster" idea.

**Why it matters.** Companies rarely publish sales data, so a predicted "success probability" would have no verifiable basis. Comparing with real products that succeeded is easier to defend, easier to explain, and produces something actionable: a list of concrete changes.

**How it works.**
1. **Embed.** The user's product profile is converted into a vector (a numeric representation of its meaning).
2. **Retrieve.** The vector database is searched for the most similar products, filtered by target market and category, so only relevant cases come back.
3. **Compare.** The LLM compares the user's product with each analog on price, pack size, flavor, packaging, positioning, and channel.
4. **Recommend.** It proposes modifications that would close the gap, and links each to the analog that motivated it.
5. **Score and explain.** It outputs a **market fit score** whose inputs are visible, plus a confidence level that reflects how much evidence was found.

**Success is measured with proxy signals**, because true sales data is usually private:

| Proxy signal | Typical source |
|---|---|
| Ratings and review counts | Public e-commerce datasets |
| Product attributes, labels, countries of sale | Open product databases (e.g., Open Food Facts) |
| Search-interest trend | Google Trends |
| Launch stories, "top-selling in state" coverage, case studies | Web search, ingested into the knowledge base |
| Category size and growth | Public reports, government data |

**Output.**

```json
{
  "analog_products": [
    {"name": "Analog A", "why_similar": "millet-based, similar price band", "source": "url"}
  ],
  "gap_analysis": [
    {"attribute": "pack_size", "yours": "50g", "successful_analogs": "30g and 60g"},
    {"attribute": "label_language", "yours": "Tamil", "successful_analogs": "Kannada + English"}
  ],
  "recommended_modifications": [
    {"change": "Add Kannada label", "supported_by": ["Analog A", "Analog B"], "expected_effect": "..."}
  ],
  "market_fit_score": 0.74,
  "confidence": "medium",
  "rationale": "Three relevant analogs found; two have strong review signals; one is older data",
  "evidence_count": 3
}
```

**Limits.** The output is a market fit score, **not a sales prediction**. If only one weak analog exists, confidence is set to low and the agent says so. This behavior is intentional and shown to users.

---

### Feature 5: Cultural and market intelligence

**What it is.** Before recommending anything, Prodapt studies each location. The **Cultural Analyst** covers people and culture, and the **Geo-Intelligence Agent** covers competition and footfall.

**What is analyzed.**

| Area | Details |
|---|---|
| Demographics | Population profile, age mix, urban/rural split, income indicators |
| Culture | Food habits, preferences, taboos, symbolism, language |
| Festivals and seasons | Major festivals, timing, relevance to the product category |
| Climate | Seasonal patterns that affect the product (for example, beverages, clothing) |
| Regulations | Labelling, import/export rules, advertising standards |
| Competition | Competitor listings, density by area, gaps in the market |
| Footfall | High-traffic commercial zones for activation and distribution |
| Sentiment and trends | Current search interest and public discussion |

**How it works.** Slow-changing facts (culture, regulation, historical festivals) are pulled from the pre-built knowledge base. Fast-changing facts (competitor listings, weather, trends) are fetched live. The agent then produces a structured summary with a confidence level and the sources used.

**Limits.** No universal API exists for festival and cultural data, so the MVP relies on a curated dataset for demo markets, with web search as a fallback. Coverage per market is disclosed.

---

### Feature 6: Retrieval-grounded answers with citations

**What it is.** Prodapt uses **RAG (Retrieval-Augmented Generation)**. Before an agent answers, it retrieves relevant documents and bases its answer on them, then cites them.

**Why it matters.** A plain LLM can produce fluent but invented claims. RAG reduces this by tying answers to real sources. Citations let the business, and the reviewers of this project, verify claims.

**How it works.**
1. Documents are cleaned, split into chunks, tagged with metadata (country, state, category, document type, source), converted to embeddings, and stored in a vector database.
2. At query time, the agent's question is embedded and matched against stored chunks, filtered by metadata so only relevant chunks are considered.
3. The retrieved chunks are given to the LLM as context, and the LLM is instructed to use them and cite which ones it used.
4. The output includes a `data_sources_used` field.

**Two knowledge bases exist:** one for culture, regulation, and demographics (Knowledge Base A), and one for product success cases (Knowledge Base B). See Section 8.

**Limits.** Retrieval quality and generation quality are tested separately, because they fail for different reasons (see Section 17).

---

### Feature 7: Visual adaptation

**What it is.** Prodapt renders **actual visuals** for each variant: packaging mockups, posters, or app screens. The **Creative Modifier** writes a structured design brief, and the **Visual Adaptation Agent** turns it into images conditioned on the brand's existing assets.

**Why it matters.** A brief such as "use warm festival colors" still leaves the business with work to do. A rendered mockup lets them see and judge the result immediately.

**How it works.**
1. The Creative Modifier produces a specific brief: color palette, imagery and motifs, layout notes, language, messaging, and product-specific changes.
2. The brief is translated into an image-generation prompt, together with the brand's uploaded assets as reference images.
3. The agent generates **3 to 5 variants** with slight variations (different color emphasis, different layout).
4. Where accuracy matters (logo, text), the plan is to generate the scene or background with the model and **composite the real logo and text** with an image library, because generative models often misrender text and logos.
5. Each image is stored with a reference to the brief and variant that produced it, so a single variant can later be regenerated without redoing the rest.

**Behavior by product type.** Hard products: brand-conditioned generation from real photos. Soft products: conditioned on screenshots if provided, otherwise generated from the feature brief. Idea-stage products: output is labelled a "concept visualization" in the Playbook.

**Limits.** This is the riskiest technical component. It is planned as optional in the MVP. If image generation fails, the playbook falls back to the text design brief and shows a flagged gap instead of failing entirely.

---

### Feature 8: Compliance and cultural-sensitivity checks

**What it is.** The **Compliance Validator** reviews the adapted text and images against regulatory rules and cultural-sensitivity guidelines for the target location.

**What it checks.**
- **Regulatory:** labelling formats, claims wording, mandatory statements, restricted ingredients or terms (for example, Indian food labelling rules).
- **Cultural:** colors, symbols, imagery, or phrases that carry negative meaning in the region.
- **Visual:** problematic imagery or symbolism in generated images (this needs a model that can analyze images against written guidelines, so it is a separate capability from text checking).

**How it works.** It retrieves the relevant rules from the knowledge base, checks each item, and outputs a **pass or flag** list. Each flag includes the specific concern and the source that backs it. A flag without a grounded reason is not allowed.

**Design decision.** Flagged items are shown **with a warning** rather than silently removed. This keeps a human in the loop for judgment calls without blocking the autonomous pipeline.

**Limits.** This is flagging from a curated rules set. It is **not legal advice or legal validation**, and businesses should confirm with qualified professionals before launch.

---

### Feature 9: Risk simulation

**What it is.** The **Risk Simulator** examines the complete plan and lists what could go wrong before the business commits money.

**Risk categories.**

| Category | Examples |
|---|---|
| Regulatory | Missing certification, import restrictions, labelling non-compliance |
| Cultural | Product or message that may offend, or fail to resonate |
| Market | Saturated category, price mismatch, strong incumbent, seasonal weakness |

**How it works.** It consumes the outputs of earlier agents (cultural findings, competitor data, compliance flags, analog gaps) and produces a categorized list. Each risk has a **severity** and a suggested **mitigation**. Where a risk is already covered by a compliance flag, it links to that flag instead of re-deriving it.

**Limits.** Risk levels are reasoned estimates from available data, not statistical forecasts. They are validated for consistency (similar inputs give similar levels) and explainability.

---

### Feature 10: Map-based interaction (input and output)

**What it is.** Location handling is visual at both ends of the pipeline. Users **point at places to select them**, and Prodapt **points back at recommended places**. Details are in Section 11.

**Why it matters.** Typing place names causes ambiguity (a state and a country with the same name, misspellings, unfamiliar geographies). Text lists of recommended places are hard to reason about spatially. A map removes both problems and makes the tool feel visual rather than form-based.

---

### Feature 11: Business growth strategy

**What it is.** The **Business Growth Optimizer** (Agent 10) synthesizes every earlier result into practical guidance.

**What it produces.**

| Area | Content |
|---|---|
| Pricing | Per-channel price recommendations per location (see Feature 12) |
| Marketing | Recommended channels and messaging direction |
| Distribution | Which types of outlets and which areas to prioritize, based on the Geo-Intelligence pins |
| Launch timing | Best launch window, tied explicitly to the festival and season calendar |
| Priority | Which variant, location, and channel to launch first |

**How it works.** It reuses earlier outputs rather than regenerating them: festival dates come from the Cultural Analyst, distribution targets come from the Geo-Intelligence pins, and risks and flags come from the validators. This keeps the whole plan consistent. The only new evidence it gathers is channel price comparables (Feature 12).

**Example.** "Launch the 30g trial pack in Karnataka three to four weeks before the major regional festival, prioritize general stores in high-footfall zones, add a gift pack for the festival."

---

### Feature 12: Channel pricing and launch strategy

**What it is.** A sub-capability of Agent 10 that outputs **one price recommendation per sales channel within each location**, each backed by a cited real comparable, plus channel-specific go-to-market advice.

**The gap this closes.** A single product is not sold at one price within one city. The same water bottle can be ₹10 at a street kirana, ₹30 at a cinema, and ₹200 in a 5-star hotel. These are not three different *locations*; they are three different **sales channels** inside the same location, each with its own cost structure, captive audience, and positioning expectation. Earlier drafts output one price per location. Agent 10 now outputs one price **per channel within each location**.

#### Channel taxonomy

| Channel | Why price differs | Example (water bottle) |
|---|---|---|
| General / local retail (kirana, street shop) | High competition, price-sensitive, no captive audience | ₹10 |
| Modern trade (supermarket, mall store) | Higher overhead, branding expectation, still price-comparable | ₹20 |
| Captive / convenience (cinema, airport, stadium) | No alternative nearby, markup tolerated | ₹30–₹50 |
| Premium / hospitality (5-star hotel, fine dining) | Positioning-driven, not cost-driven; price signals quality | ₹150–₹200 |
| Online / D2C | Bulk/subscription economics, delivery cost built in | Varies by pack size |
| Institutional / bulk (events, corporate) | Volume discount logic | Lower per-unit |

The example prices are illustrative only. Real values must come from retrieved comparables (the hard rule below). Which channels are relevant depends on the product profile (Section 4.1); Agent 10 selects only the channels that make sense for the product and market.

#### The hard rule: no price without a cited comparable

> **Rule:** the agent may not output a recommended price for a channel unless it has retrieved at least one real comparable price for that product category in that channel type, via web search or the knowledge base, with a source URL attached. If no comparable is found, the channel is marked `confidence: low` with an explicit note, and the price is never silently filled with a guessed number.

This is not a new mechanism. It is the same evidence-first method the Success-Analog Advisor already uses (Feature 4), applied to a new dimension, and it follows the confidence rules in Sections 10.3 and 10.5.

#### How it runs (RAP, Section 9)

Agent 10 gains one extra **Act** step per relevant channel, before Finalize:

1. **Plan:** list the relevant channels for this product and location.
2. **Reason ⇄ Act:** for each channel, run a web search (or knowledge-base lookup) for real comparable prices of the product category in that channel type. Act remains a plain deterministic tool call, never an LLM call.
3. **Finalize:** compute each recommendation from the retrieved comparables, attach `evidence_sources`, `retrieval_date`, and `confidence`, and emit the schema below.

The loop stays under the hard step cap (Section 9). If the number of channels exceeds the cap, channels are ranked by relevance and the remainder are marked `confidence: low` with a "not researched" note rather than guessed. Results are cached per market and channel for a short window (Section 6.3, cost control).

#### Output schema (Agent 10)

```json
{
  "location": "Karnataka",
  "channel_pricing_strategy": [
    {
      "channel": "cinema_concession",
      "recommended_price": "INR 30",
      "rationale": "Captive-audience markup is standard for single-serve beverages in this channel",
      "evidence_sources": ["https://...", "https://..."],
      "retrieval_date": "2026-09",
      "confidence": "high"
    },
    {
      "channel": "five_star_hotel",
      "recommended_price": "INR 180–220",
      "rationale": "Hospitality-channel pricing is positioning-driven, not cost-driven; comparable premium water brands in this price band",
      "evidence_sources": ["https://..."],
      "retrieval_date": "2026-09",
      "confidence": "medium"
    },
    {
      "channel": "online_d2c",
      "recommended_price": null,
      "rationale": "No real comparable found for this category in this channel",
      "evidence_sources": [],
      "confidence": "low",
      "note": "No comparable retrieved; price intentionally not guessed"
    }
  ],
  "channel_sales_strategy": [
    {
      "channel": "cinema_concession",
      "entry_approach": "Distributor commission norms for this channel, typical listing process",
      "promotional_tie_in": "Align with major regional film releases",
      "priority_rank": 2
    }
  ],
  "assumptions": [],
  "confidence": "medium"
}
```

Rules enforced at Finalize: `recommended_price` may be `null` when no comparable exists; `evidence_sources` must be non-empty for any channel rated `medium` or `high`; an output that violates this is rejected and retried, or forced to `confidence: low`.

#### Why this belongs to Agent 10, not a new agent

It reuses existing infrastructure: the web-search tool (Section 8.6), the evidence-with-citation pattern (Success-Analog Advisor), and the confidence-scoring rules (Section 10.3). It is Agent 10 doing one more Act step per channel, following the exact RAP pattern, so the system stays at 10 agents.

#### What the user gets

- A **per-channel price matrix**, not one flat number, directly solving the ₹10 / ₹30 / ₹200 problem.
- Every price tied to a **real cited comparable**, so it is defensible rather than invented.
- **Channel-specific go-to-market advice:** which channel to enter first, how to get listed, and what promotional angle fits.
- **Explicit low-confidence flagging** when no comparable exists, consistent with the rest of the system.

**Limits.** Channel prices are evidence-based recommendations from public comparables, not guaranteed achievable prices.

---

### Feature 13: Autonomous mode with confidence scores

**What it is.** Prodapt runs as a **single autonomous job**. The only required input is the product information.

**Rules.**
- Agents never ask clarifying questions.
- If information is missing after retrieval and tool use, the agent infers the most reasonable value from the product category and market norms.
- Every inference is recorded as `{field, assumption, confidence}`, for example: *"Assumed premium positioning based on current price point, confidence: medium."*
- Assumptions are visible but never block the pipeline.
- The user reviews the finished playbook and may then **edit a variant or regenerate visuals**. This is supported through scoped re-runs of a single agent while the rest of the outputs stay fixed.

**Why it matters.** Small businesses don't want a long questionnaire, and pipelines that pause for input are slow and fragile. Making assumptions visible keeps trust without adding friction.

---

### Feature 14: Explainability

**What it is.** Every decision carries three things:

| Element | Meaning |
|---|---|
| **Rationale** | Why the agent reached this result |
| **Evidence** | Which sources or analog products support it |
| **Confidence** | High, medium, or low, based on how strong the evidence is |

**How confidence is set.** High confidence requires several relevant, consistent, curated sources. Medium applies when evidence is thin or comes mainly from web search. Low applies when the result rests mostly on assumptions. The rationale must explain why that level was chosen. When evidence is weak, the system lowers confidence and says so, rather than sounding certain.

**Why it matters.** Businesses only act on advice they can understand and check, and project reviewers can see that the system is not a black box.

---

### Feature 15: Expansion Playbook

**What it is.** The final deliverable, one per product. It combines all outputs into a single document and an interactive view. See Section 12 for its full contents.

**Why it matters.** Without it, a user would have to read separate reports for culture, compliance, pricing, and visuals. The playbook is organized so a user can act on **one variant end to end**: its image, its fit score, its risks, and its channel price matrix together.

---

## 6. System Architecture


### Feature 16: Prodapt AI Copilot / Conversational Expansion Assistant

**What it is.** Prodapt includes a user-facing **AI Copilot** that allows users to interact with the platform through natural-language conversation. The Copilot is a conversational interface over Prodapt's existing RAG layer, structured outputs, Expansion Playbook, map intelligence, and agent results. It is **not a separate 11th business-analysis agent**; it acts as an intelligent interaction layer that helps the user understand, explore, modify, and execute actions using the existing Prodapt pipeline.

**What the user can ask.**
- *"Why did Prodapt recommend Kerala?"*
- *"Explain the fit score for this location."*
- *"Compare Kerala and Karnataka for this product."*
- *"Why is the recommended price different for online and retail?"*
- *"Make this package smaller for the Kerala market."*
- *"Show me the compliance risks for this variant."*
- *"What changes should I make to the packaging?"*
- *"Generate the expansion playbook for this market."*

**Context-aware conversation.** The Copilot uses the page, product, market, variant, agent outputs, and playbook section currently being viewed as conversational context. For example, if the user is viewing **Kerala → Expansion Playbook → Pricing**, asking *"Why is this price higher?"* should refer to that specific product, market, channel, comparable, and recommendation instead of requiring the user to repeat the context.

**How it works.**

```text
User
  │
  ▼
Prodapt AI Copilot
  │
  ▼
Intent / Query Router
  │
  ├── Retrieve evidence ──► RAG Knowledge Base
  │
  ├── Read results ───────► Existing Agent Outputs
  │
  ├── Read context ───────► Product / Market / Variant / Playbook
  │
  └── Request action ─────► Existing Agent / Scoped Re-run / Playbook Action
  │
  ▼
Grounded Response + Evidence + Confidence
  │
  ▼
User
```

**Core capabilities.**

| Capability | Description |
|---|---|
| Explain | Explains fit scores, recommendations, risks, prices, cultural findings, and agent outputs |
| Compare | Compares selected locations, variants, channels, prices, risks, or recommendations |
| Ask | Answers natural-language questions using retrieved evidence and existing Prodapt data |
| Modify | Converts user requests into supported product/variant changes and scoped re-runs |
| Navigate | Helps the user find relevant sections of the Playbook, map, pricing, risks, or recommendations |
| Generate | Triggers supported actions such as generating or regenerating a playbook/variant |
| Summarize | Produces concise summaries of a market, product variant, or complete expansion plan |
| Evidence lookup | Shows the sources, analogs, assumptions, and confidence behind an answer |

**Grounding rules.**
1. The Copilot must use the existing RAG pipeline and stored Prodapt outputs whenever factual project data is available.
2. It must not invent a location score, price, comparable, compliance requirement, source, agent result, or product attribute.
3. Answers about recommendations should expose the relevant rationale, evidence, and confidence when available.
4. If evidence is insufficient, the Copilot should state that the information is unavailable or low-confidence rather than fabricate an answer.
5. User-requested changes should use the existing scoped re-run mechanism where applicable, keeping unaffected outputs unchanged.
6. The Copilot should distinguish between information retrieved from Prodapt data and newly generated suggestions.

**Relationship with the ten agents.** The Copilot does not replace the existing ten-agent architecture. The ten specialized agents remain responsible for their defined analysis tasks. The Copilot provides a conversational access layer over those results and can request supported actions from the existing orchestration system.

**Suggested UI.**
- A persistent **"Prodapt AI Copilot"** button in the application.
- Expandable chat panel or full-page assistant.
- Suggested prompts based on the current screen.
- Context indicator showing the current product, location, variant, or Playbook section.
- Evidence/source cards for grounded answers.
- Action buttons such as **Apply Change**, **Compare**, **Regenerate Variant**, **Open Playbook**, and **View on Map** where supported.
- Conversation history for the current product/job.
- Clear indication when an answer has low confidence or insufficient evidence.

**Why it matters.** The existing platform produces a large amount of structured information across agents, maps, pricing, compliance, risks, visuals, and the Expansion Playbook. A conversational interface makes those outputs easier for a business user to understand and interact with without replacing the underlying evidence-based workflow.

**Implementation principle.** The Copilot should sit **above the existing orchestration and agent architecture**, not duplicate it:

```text
React Frontend
     │
     ├── Standard UI ───────────────► Prodapt API
     │
     └── AI Copilot ────────────────► Copilot API
                                          │
                                          ▼
                                  Intent / Query Router
                                          │
                         ┌────────────────┼────────────────┐
                         ▼                ▼                ▼
                       RAG          Existing Job       Agent Actions
                    / Sources        Outputs          / Scoped Re-run
                         └────────────────┼────────────────┘
                                          ▼
                                  Grounded Response
```

The Copilot therefore becomes a **conversational control and explanation layer** for Prodapt rather than another independent analysis agent.

### 6.1 Layered view

```
┌──────────────────────────────────────────────────────────────────┐
│ Frontend (React + Mapbox)                                         │
│  Product Intake │ Map Selector │ Job Progress │ Playbook + Map     │
└───────────────────────────┬──────────────────────────────────────┘
                            │ REST + WebSocket/SSE (job progress)
┌───────────────────────────▼──────────────────────────────────────┐
│ API layer (FastAPI, Pydantic validation, auth, rate limiting)     │
└───────────────────────────┬──────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│ Orchestration (LangGraph + Celery/Redis)                          │
│  sequencing, parallel steps, retries, scoped re-runs, state       │
└───────────────────────────┬──────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│ Agents (10)  ── each uses Plan → Reason ⇄ Act → Finalize          │
└───────┬──────────────┬──────────────┬─────────────┬──────────────┘
        │              │              │             │
   Vector DB      Live tools     Image model    LLM (structured
   (Chroma:       (Places, web   (reference-    output / tool use)
   KB-A, KB-B)    search,        conditioned)
                  weather)
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│ Storage: PostgreSQL + PostGIS │ Object storage │ Redis cache      │
└──────────────────────────────────────────────────────────────────┘
```

The frontend never talks to an agent directly. It calls a backend job endpoint, the backend runs the agents, and the finished playbook comes back as one payload (text, structured data, image URLs, and map pin data).

### 6.2 End-to-end pipeline

```
Product Intake (product type + product details + brand assets/images + optional map selection)
        │
        ▼
Product Profiler  →  structured product profile
        │
        ▼
Location Recommender  →  ranked launch locations (fit score, reasons, evidence)
        │            (user may confirm, add, or override locations on the map)
        ▼
For each recommended location:
   ├─ Cultural Analyst        →  culture, demographics, festivals, climate
   └─ Geo-Intelligence Agent  →  competitor density, footfall zones, distribution targets
        │   (these two run in parallel)
        ▼
Success-Analog Advisor  →  similar successful products, gap analysis, modifications
        │
        ▼
Creative Modifier  →  design briefs + product change specs
        │
        ▼
Visual Adaptation Agent  →  rendered mockups / posters / UI screens
        │
        ▼
Compliance Validator + Risk Simulator  (run in parallel)
        │
        ▼
Business Growth Optimizer  →  per-channel pricing (web-search comparables), channel sales
        │                      strategy, launch timing, distribution plan
        ▼
Expansion Playbook (strategy + visuals + ranked locations + channel price matrix + interactive map)
```

### 6.3 Orchestration behavior

| Requirement | How it is handled |
|---|---|
| Parallel steps | Cultural Analyst and Geo-Intelligence run together; Compliance Validator and Risk Simulator run together |
| Scoped re-run | A user can regenerate one variant's visuals without rerunning the whole pipeline, because intermediate outputs are stored |
| Partial failure | If one agent (for example, image generation) fails, the rest continue and the playbook shows a flagged gap |
| Schema safety | Every agent output is validated against its schema before it is passed on; on failure the agent retries with a repair prompt |
| Traceability | Every tool call, retrieval query, and agent run is logged (input hash, latency, tokens, confidence) |
| Cost control | Live-tool results for a market are cached for a short window; channel-price lookups are cached per market and channel |

---

## 7. The Ten Agents

The system has **10 agents, not 7**. The Product Profiler, Location Recommender, and Success-Analog Advisor (which replaces the earlier "Sales Forecaster") were added in the authoritative README, and older documents that mention seven agents are out of date.

Each agent is an independently testable unit with a defined input schema, output schema, allowed tools, a versioned system prompt, and a fallback behavior. Every agent follows the RAP pattern (Section 9), and **every output includes `confidence`, `rationale`, and `assumptions` fields.**

### 7.1 Summary table

| # | Agent | Input | Allowed tools | Key output |
|---|---|---|---|---|
| 1 | Product Profiler | Raw product details, product type, brand assets | Image understanding | Structured product profile |
| 2 | Location Recommender | Product profile, optional candidate regions | Vector retrieval (KB-A, KB-B), web search, trends | Ranked locations with fit scores |
| 3 | Cultural Analyst | Product profile, location | Vector retrieval (KB-A), web search, weather | Culture, festivals, preferences, taboos |
| 4 | Geo-Intelligence Agent | Location coordinates, product category | Places API / OpenStreetMap | Scored pins (competitor, distribution, footfall) |
| 5 | Success-Analog Advisor | Product profile, location | Vector retrieval (KB-B), web search | Analogs, gap analysis, modifications, market fit score |
| 6 | Creative Modifier | Cultural output, analog output, profile | None (reasoning only) | Design brief and product change specs |
| 7 | Visual Adaptation Agent | Brief, brand assets | Image generation, compositing | Rendered variants |
| 8 | Compliance Validator | Text brief, images, location | Vector retrieval (KB-A regulation), image analysis | Pass/flag list with sources |
| 9 | Risk Simulator | All prior outputs | Risk indices (optional) | Categorized risks, severity, mitigation |
| 10 | Business Growth Optimizer | All prior outputs | Web search (channel price comparables only; otherwise synthesis) | Per-channel pricing, channel sales strategy, timing, distribution plan |

Tool access is kept minimal per agent, which makes testing and cost control easier.

### 7.2 Agent notes

**Product Profiler.** Extracts and normalizes attributes, branches by `product_type` (Section 4.1), describes the visual identity from images when present, and records assumptions. It never asks the user questions.

**Location Recommender.** Generates candidates (from map input or defaults), retrieves evidence for each, scores them with explainable components (Section 10.1), ranks them, and writes reasons. It is the entry point of the "product → where to launch" flow (Pillar 1).

**Cultural Analyst.** Grounds every cultural claim in retrieved chunks and cites them. Where the knowledge base is empty for a market, it falls back to web search and lowers confidence.

```json
{
  "demographics_summary": "string",
  "cultural_notes": ["string"],
  "relevant_festivals": [{"name": "", "timing": "", "relevance_to_product": ""}],
  "preferences_and_taboos": ["string"],
  "confidence": "high | medium | low",
  "rationale": "string",
  "assumptions": [],
  "data_sources_used": ["string"]
}
```

**Geo-Intelligence Agent.** Mostly live tools, with little RAG, because it needs current listings. Its output is map-ready: a list of `{lat, lng, name, category, rationale, score}` objects, not prose. Categories are competitor density, retail or distribution partner targets, and high-footfall activation zones (premium vs. mass market). In the MVP, footfall is estimated with a heuristic (point-of-interest density plus demographic layer). Real footfall data is a later upgrade.

**Success-Analog Advisor.** Described in Feature 4; it is the engine behind the evidence-based half of Pillar 2. Retrieval is filtered by market and category before similarity ranking. If it finds too few analogs, it widens to a neighboring market or category and states that it did.

**Creative Modifier.** The other half of Pillar 2. Produces a structured brief, not prose. It uses a shared base schema (color, tone, positioning) plus category-specific extension fields, because a poster brief and a packaging brief need different fields. Every field must be specific enough to act on ("use saffron and deep green with a festival motif," not "make it festive").

**Visual Adaptation Agent.** Described in Feature 7. Generates 3 to 5 variants, stores each with a back-reference to its brief, and supports single-variant regeneration. Real logos and text are composited with an image library rather than trusted to the generative model.

**Compliance Validator.** Described in Feature 8. Validates text and images separately, since image analysis is a distinct capability. Flags are shown with a warning, never silently removed.

**Risk Simulator.** Described in Feature 9. Links to compliance flags rather than duplicating them.

**Business Growth Optimizer.** Described in Features 11 and 12. Reuses earlier outputs, especially the festival calendar and the geo pins, and owns Channel Pricing & Launch Strategy.

---

## 8. Knowledge and Data Layer (RAG)

### 8.1 Where each kind of information lives

Every fact the agents need falls into one of three buckets. Putting data in the wrong bucket is the most common RAG mistake (for example, embedding a competitor list that becomes stale within weeks).

| Bucket | Examples | Handling |
|---|---|---|
| **Static or slow-changing** | Cultural norms, festival patterns, general regulations, past case studies, product success cases | Pre-ingested into the vector database (RAG) |
| **Live or fast-changing** | Competitor listings, weather, current trends, current pricing and channel price comparables | Fetched at query time through APIs; never pre-embedded |
| **Pure reasoning** | Fit scoring, pricing recommendation, synthesis | Computed by the LLM from other agents' outputs |

### 8.2 Knowledge Base A: culture, regulation, demographics

| Data type | Sources |
|---|---|
| Demographics | Census and statistics bureaus (for India: Census of India, MOSPI), World Bank Open Data |
| Festivals and calendars | Tourism board and cultural ministry calendars; curated internal dataset (no reliable universal API exists) |
| Climate | National meteorological summaries; weather APIs for seasonal patterns |
| Regulations | Government regulatory portals (for example, FSSAI for food in India), trade and export portals, curated into an internal rules dataset |
| Cultural preferences | Public consumer-research reports and regional studies |

### 8.3 Knowledge Base B: product success cases

Each record describes one product in one market:

```json
{
  "product": "Brand X ragi biscuit",
  "category": "Biscuits",
  "market": "Karnataka",
  "price_band": "INR 10 / 50g",
  "pack_size": "50g",
  "key_attributes": ["millet-based", "Kannada labelling", "festival packs"],
  "success_signals": {"rating": 4.3, "review_count": 12000, "trend_note": "rising search interest"},
  "source_url": "https://...",
  "date": "2025-08"
}
```

The MVP target is roughly **100 to 300 cases** in one category across 2 to 3 states, which is enough to demonstrate and evaluate the approach.

### 8.4 Ingestion pipeline

1. **Source.** Collect documents and datasets per data type.
2. **Clean.** Remove menus, footers, ads, and boilerplate; convert to plain text or markdown; extract only relevant sections from large PDFs.
3. **Chunk.** Split at natural boundaries (headings, paragraphs), roughly 300 to 500 words per chunk.
4. **Tag.** Attach metadata: country, state or region, product category, document type (regulatory, cultural, festival, demographic, success case), source citation, and date.
5. **Embed and store.** Convert to embeddings and store in the vector database.
6. **Re-ingest.** Ingestion is designed to be re-runnable incrementally (only new or changed documents), so regulations and calendars don't go stale.

### 8.5 Retrieval

1. **Filter first** by metadata (for example, only India, Karnataka, biscuits).
2. **Rank by similarity** among the filtered chunks.
3. **Optionally rerank** the top results with a reranker or a similarity-weighted score.
4. **Pass to the LLM** with instructions to use only the provided context and to cite it.

A retrieval step is considered ready when, for at least ten (product category, location) test pairs, the returned chunks are relevant and correctly scoped.

### 8.6 Live tools

| Tool | Used for |
|---|---|
| Google Places API or OpenStreetMap Overpass | Competitor density, retail partners, footfall estimation |
| Web search (Tavily or similar) | Current trends, sentiment, gaps in the knowledge base; **real comparable prices per sales channel (Agent 10, Feature 12)** |
| Weather API (OpenWeatherMap) | Climate and seasonal context |
| Google Trends | Search-interest signals used as a success proxy |

---

## 9. The RAP Agent Pattern

RAP stands for **Reason, Act, Plan**, run as **Plan → (Reason ⇄ Act, looped) → Finalize**.

| Stage | What happens |
|---|---|
| **Plan** | Before using any tool, the agent writes a short numbered plan (3 to 5 steps) of what it needs to find out |
| **Reason** | At each step, the agent looks at what it knows, what is missing, and picks the next action |
| **Act** | It calls one tool (retrieval, web search, places lookup). Act steps are plain deterministic functions, **never LLM calls** |
| **Loop** | Reason and Act repeat until the plan is satisfied or a **hard step cap** is reached |
| **Finalize** | One structured-output call converts everything gathered into the exact schema the next agent expects, including confidence and rationale |

**Why RAP suits Prodapt.**
- Each agent answers a compound question (for example, "what is the cultural and festival context of this market for this product?"). An explicit plan stops the agent from acting randomly or stopping too early.
- Finalize is the natural place to enforce visible rationale and confidence, since the agent can look back at its own plan and evidence.
- Multi-agent hand-offs need schema-stable outputs. A bounded, planned loop is easier to cap and validate than an open-ended loop.

**Loop sketch.**

```python
MAX_STEPS = 6

def run_agent(input_data):
    plan = generate_plan(input_data)                       # Plan
    scratchpad = []
    for step in range(MAX_STEPS):
        decision = reason(plan, scratchpad)                # Reason
        if decision["action"] == "finalize":
            break
        result = act(decision["action"], decision["tool_input"])   # Act
        scratchpad.append({"step": step, **decision, "result": result})
    return finalize(plan, scratchpad, input_data)          # Finalize (structured output)
```

**Design rules.**
- Always cap the loop; unbounded agents run up cost or oscillate.
- Keep Act as deterministic function calls; only Plan, Reason, and Finalize are LLM calls.
- Force structured output at Finalize (schema-enforced tool use), so the result is always valid JSON.
- Standardize the action format as `{"action": "query_curated_dataset", "tool_input": "..."}` so the Act function can match it exactly.

**Testing an agent in isolation.**
1. Schema conformance on several fixed (product, market) fixtures.
2. Fallback behavior when the curated dataset returns nothing.
3. Step-cap test: even if the agent never chooses to finalize, the loop ends and Finalize still runs.
4. Regression snapshots, to catch quality drift after prompt or model changes.

---

## 10. Scoring, Confidence and Autonomous Mode

### 10.1 Location fit score (Pillar 1)

The fit score is a weighted combination of components the user can see. The weights below are a starting point and are meant to be tuned and evaluated, not treated as fixed truths.

| Component | What it measures | Example weight |
|---|---|---|
| Category demand | Demand and growth for this product type in the location | 0.30 |
| Cultural and demographic fit | Match with tastes, habits, language, population profile | 0.25 |
| Price fit | Match between the price band and local spending and price points | 0.15 |
| Competition gap | Room in the market; not over-saturated | 0.15 |
| Regulatory ease | How easily the product meets local rules | 0.10 |
| Seasonal and climate fit | Match with season, climate, and festival calendar | 0.05 |

`fit_score = Σ(weight × component score)`. Showing the breakdown lets users see why one location outranks another.

### 10.2 Market fit score (Success-Analog Advisor)

Built from visible inputs: how similar the retrieved analogs are to the user's product, how many analogs were found, and how strong their proxy signals are. It is called a **market fit score** because it is a similarity-and-evidence measure, not a forecast of sales.

### 10.3 Confidence levels

| Level | When it applies |
|---|---|
| **High** | Several relevant, consistent sources or analogs, mostly from curated data |
| **Medium** | Fewer sources, or evidence mostly from web search or older data |
| **Low** | Result rests mainly on assumptions or a single weak source |

The rationale field must explain why that level was chosen.

### 10.4 Assumption logging and autonomous rules

```json
{
  "assumptions": [
    {"field": "positioning", "assumption": "mass market", "confidence": "medium"},
    {"field": "target_customer", "assumption": "families", "confidence": "medium"}
  ]
}
```

Every agent includes this field. Every agent's prompt says: never ask a clarifying question; if information is missing, infer the most reasonable value and log it. The only required input is the product information (Section 4); assumptions are visible but never block the pipeline.

### 10.5 Channel price confidence (Agent 10)

The confidence levels above are applied to each channel price individually:

| Level | Criteria |
|---|---|
| **High** | Two or more consistent, recent comparables for the category in that channel type, with source URLs |
| **Medium** | One solid comparable, or several older or less consistent ones, with source URLs |
| **Low** | No comparable found (price left `null` or clearly flagged), or a single weak or indirect source |

A price is **never** reported as `medium` or `high` without at least one cited source URL.

### 10.6 Edit and regenerate (scoped re-run)

Because intermediate outputs are stored, the user can edit a variant or regenerate its visuals after the playbook is delivered. The orchestrator re-runs only the affected agent, with everything else held constant.

---

## 11. Map-Based Interaction

### 11.1 Input: visual target-market selection

- On the Product Intake page, the user clicks or draws on an embedded interactive map to select markets, instead of typing place names.
- Single or multiple locations can be selected in one action (for example, several cities for a multi-market plan).
- A search-to-locate control jumps to a region before precise clicking, which helps with large countries and unfamiliar geographies.
- Each click is confirmed as a **removable tagged chip** with an auto-filled place name (through reverse geocoding), which removes ambiguity between similarly named places.
- **Selection is optional.** If the user selects nothing, the Location Recommender proposes locations.

### 11.2 Output: visual recommended-location display

- Recommended launch, distribution, and activation locations appear as **pins on an interactive map**, not as a text list.
- Pins are **color-coded** by type: competitor density (avoid saturation), retail or distribution partner targets, and high-footfall activation zones (premium vs. mass market).
- Clicking a pin opens a **card** with the location name, rationale, fit or footfall score, and an "add to distribution plan" action.
- A **filter bar** shows or hides pin categories, so the map stays readable when there are many pins.
- The same interactive map is **embedded in the Expansion Playbook**.

### 11.3 Pin data format

```json
{
  "lat": 12.9716,
  "lng": 77.5946,
  "name": "Commercial zone, Bengaluru",
  "category": "footfall_mass_market",
  "rationale": "High retail density and mid-income catchment",
  "score": 0.78
}
```

This makes the input method (point at a place) and the output method (Prodapt points back at places) symmetrical.

---

## 12. The Expansion Playbook

The playbook is organized so one variant can be read end to end: its image, fit score, risks, and channel price matrix together, rather than scattered across sections.

| Section | Contents |
|---|---|
| Product profile | Structured profile and all assumptions made |
| Ranked launch locations | Fit scores, score breakdowns, reasons, evidence, confidence |
| Location intelligence | Culture, demographics, festivals, climate, regulations, competition |
| Success analogs | Similar successful products, gap analysis, recommended modifications with their supporting analogs |
| Variants | 3 to 5 adapted variants per location, each with reasoning and rendered visuals (Idea-stage visuals labelled "concept visualization") |
| Compliance flags | Each flag with its concern and source |
| Risks | Categorized risks with severity and mitigation |
| Channel pricing matrix | Per-channel recommended price for each location, with rationale, cited comparable sources, retrieval date, and confidence; channels with no comparable shown as low-confidence, not guessed |
| Channel sales strategy | Priority-ranked channels, entry approach (listing/distributor norms), promotional tie-ins |
| Business strategy | Marketing channels, distribution plan, and launch timing, alongside the channel strategy above |
| Interactive map | Pins for competitors, distribution targets, and activation zones, with filters |
| Confidence and assumptions | Every assumption and confidence level in one place |
| Export | Downloadable branded document (PDF) |

---

## 13. Scope: What Prodapt Can Adapt

Any output meant for human consumption has a **surface** (design, packaging, presentation) and a **substance** (content, features, pricing). Prodapt's agents work on both.

| Category | What Prodapt adapts | Example |
|---|---|---|
| FMCG / consumer goods | Ingredients, packaging, size, pricing | Flavor and pack size adjusted for regional taste and price sensitivity |
| Food and beverage | Menu, ingredients, pricing | Regional menu variants |
| Fashion and textiles | Fabric, sizing, color, silhouette | Silhouette adjusted for regional climate and preference |
| E-commerce / D2C | Pricing, positioning, logistics | State-to-state or country expansion variants |
| Movies / TV / streaming | Poster art, trailer cut, title and tagline, dubbing tone, release timing, casting emphasis | Poster color symbolism adjusted for a target market |
| Music / albums | Cover art, single choice, release timing, features | Lead single chosen from regional genre trends |
| Books / publishing | Cover design, title localization, pacing notes, blurb | Cover imagery changed where symbolism doesn't translate |
| Video games | UI/UX localization, monetization model, content sensitivity, launch timing | Monetization model swapped based on regional regulation |
| Apps / SaaS | UI, pricing, payment methods, onboarding tone | Localized onboarding and payment options |
| Events / experiences | Format, pricing tiers, timing, venue positioning | Ticketed event restructured for local expectations |
| Real estate marketing | Listing photography style, description tone, amenities emphasis | Listing emphasis shifted by market priority |

Each new category needs its own Creative Modifier prompt and schema extension, so category expansion is ongoing work. **The MVP focuses on one category (packaged food and beverage) and 2 to 3 Indian states.**

---

## 14. Data Model and API

### 14.1 Core entities

| Entity | Key fields |
|---|---|
| `products` | id, product_type (hard / soft / idea), name, category, description, base_price, currency, current_markets[], type_details_json, image_urls_json (angle → url), brand_asset_urls[] |
| `product_profiles` | id, product_id, profile_json, assumptions_json |
| `target_markets` | id, product_id, geo_boundary or point, market_name, selection_type (point / region / recommended) |
| `location_recommendations` | id, job_id, location, rank, fit_score, score_breakdown_json, rationale, evidence_json, confidence |
| `pipeline_jobs` | id, product_id, status, current_stage, started_at, completed_at |
| `agent_outputs` | id, job_id, agent_name, output_json, confidence, rationale, created_at |
| `variants` | id, job_id, location, variant_number, design_brief_json, rendered_asset_url, compliance_status, market_fit_score, risk_flags[] |
| `geo_recommendations` | id, job_id, lat, lng, category (competitor / distribution / footfall), score, rationale |
| `channel_pricing` | id, job_id, location, channel, recommended_price (nullable), rationale, evidence_sources[], retrieval_date, confidence, note, entry_approach, promotional_tie_in, priority_rank |
| `playbooks` | id, job_id, final_document_url, map_config_json, created_at |

Success-case records (Knowledge Base B) and knowledge chunks (Knowledge Base A) live in the vector database with their metadata.

### 14.2 Representative endpoints

```
POST   /api/products                          create product intake
POST   /api/products/{id}/markets             attach map-selected target markets (optional)
POST   /api/products/{id}/recommend-locations run Product Profiler + Location Recommender
POST   /api/products/{id}/generate            start the autonomous pipeline job
GET    /api/jobs/{id}/status                  poll or subscribe (WebSocket) for progress
GET    /api/jobs/{id}/playbook                fetch the completed Expansion Playbook
GET    /api/jobs/{id}/locations               ranked location recommendations
GET    /api/jobs/{id}/geo-recommendations     pins for the map, filterable by category
GET    /api/jobs/{id}/channel-pricing         per-channel price matrix + channel sales strategy,
                                              filterable by location and channel
PATCH  /api/variants/{id}                     edit or regenerate one variant
```

---

## 15. Technology Stack and Build Path

### 15.1 Technology stack

| Layer | Choice | Why / alternatives |
|---|---|---|
| LLM (all agents) | Claude (Anthropic API), using tool use for structured JSON output | Strong tool use and structured output. Alternatives: Gemini, OpenAI. Free tiers such as Gemini's can be used for prototyping |
| Orchestration | LangGraph | Fits sequential, parallel, and scoped re-run needs. Alternatives: CrewAI, custom DAG runner |
| Embeddings | Voyage AI (voyage-3 or a current Voyage model) | Pairs well with Claude. Free fallback: sentence-transformers running locally |
| Vector database | Chroma (or Supabase `pgvector` in the unified build path) | Metadata filtering; local/free to start. Migrate to Qdrant Cloud if needed |
| Web search | Tavily API | Alternatives: SerpAPI, Bing Search API. Also used for channel price comparables |
| Maps / places | Google Places API | Best retail coverage. Free option: OpenStreetMap Overpass |
| Weather | OpenWeatherMap API | Seasonal and climate context |
| Image generation | Reference-conditioned image model (e.g., Gemini image) | Pillow for compositing real logos and text |
| Backend | FastAPI (Python) + Pydantic, **or** Supabase Edge Functions (TypeScript) in the unified build | Python-native agent tooling; Pydantic enforces schemas |
| Database | PostgreSQL + PostGIS | Relational entities plus geospatial queries |
| File storage | Cloudflare R2 / S3-compatible | Brand assets, product images, renders, exports |
| Job queue | Celery + Redis | Async pipeline runs, caching |
| Frontend | React + TypeScript, Tailwind CSS | Typed schemas prevent shape errors |
| Mapping | Mapbox GL JS (+ Draw plugin) | Custom pins, clustering, click and draw selection |
| Hosting | Railway (MVP) → AWS/GCP (scale) | Fast to deploy |
| Observability | Langfuse (LLM calls), Sentry (errors) | Tracks prompts, tokens, cost, latency |
| Testing | pytest, Vitest, Playwright, schema validation | Unit, integration, and end-to-end |
| CI/CD | GitHub Actions | Lint, test, build, deploy |

**Free-tier prototyping stack:** Chroma or pgvector (free), sentence-transformers (local), FastAPI or Supabase Edge Functions, React, Mapbox free tier, and a free-tier LLM API. Free-tier limits change often, so check each provider's current pricing before relying on it. LLM API access from some providers is paid, so verify before planning around it.

Tool choices are detailed in `Prodapt_Technology_and_Tools_Stack.md` and `Prodapt_Tool_Stack.pdf`.

### 15.2 Recommended build path (decided during planning)

Build **one unified codebase**, not two separate projects:

1. **Lovable** (free tier) scaffolds the frontend and Supabase backend shell (auth, intake form, map UI, Postgres + `pgvector`, storage, playbook display), including **stub agent functions** that return correctly shaped placeholder JSON so the full user flow is clickable from day one.
2. Connect the Lovable project to GitHub (its built-in two-way sync).
3. Clone the repo and open it in **Google Antigravity** (free agentic IDE) or Claude (for example, Claude Code).
4. Replace each stub function's body with real RAP-loop agent logic, one agent at a time, keeping the exact input/output shape. No integration step is needed, since it is all one repo.
5. Push back to GitHub; Lovable and Antigravity both operate on the same codebase.

---

## 16. SDLC, MVP Scope and Roadmap

### 16.1 Development model

**Agile/Scrum with a walking-skeleton first sprint.** One-week sprints, 6 to 8 sprints for the MVP plus a hardening sprint. Reasons:
- Agent behavior is inherently uncertain (build, test, adjust, rather than lock everything upfront).
- A thin end-to-end slice (intake → stub agent → static playbook with a map) proves the whole request lifecycle and de-risks integration before any real intelligence is added.
- External APIs will surprise you.

### 16.2 Suggested build order

| Step | Work |
|---|---|
| 0 | Write every agent's input/output contract before coding |
| 1 | Seed data (festivals, demographics, rules) and product success cases for the demo markets |
| 2 | Ingest into the vector database; test retrieval manually |
| 3 | Build the Product Profiler and Location Recommender; test in isolation |
| 4 | Build the Cultural Analyst and Success-Analog Advisor using the RAP pattern |
| 5 | Add the Creative Modifier and Compliance Validator |
| 6 | Add the Business Growth Optimizer (including per-channel pricing) and playbook assembly |
| 7 | Build the React + Mapbox UI (map input and pin output) |
| 8 | Add orchestration, scoped re-runs, and progress updates |
| 9 | Add image generation, Geo-Intelligence live data, and the Risk Simulator |
| 10 | Run the evaluation (with and without RAG) and prepare the demo |

### 16.3 MVP scope (MoSCoW)

**Must-have**
- One category (packaged food and beverage), 2 to 3 Indian states
- Product-type-aware intake (hard / soft / idea)
- Product Profiler, Location Recommender, Cultural Analyst, Success-Analog Advisor, Creative Modifier, Compliance Validator, Business Growth Optimizer (including per-channel pricing with cited comparables for 3 to 4 core channels)
- Both knowledge bases seeded (about 100 to 300 product cases)
- Map input and map output
- Autonomous mode with confidence, rationale, and assumptions
- Expansion Playbook with ranked locations
- 3 variants per location (not 5)

**Should-have**
- Visual Adaptation Agent with brand-conditioned mockups
- Geo-Intelligence with live places data, and the Risk Simulator
- Edit and regenerate variant flow

**Later**
- All six channel types with deeper channel-specific go-to-market playbooks
- More product categories and regions
- Human-in-the-loop review for enterprise customers
- Feedback loop from real launch outcomes to improve rankings and analogs
- Billing and multi-tenant support, real footfall data

### 16.4 Team roles (if building with a team)

| Role | Responsibility |
|---|---|
| Product / PM | PRD, prioritization, demo narrative |
| Frontend engineer(s) | Map UI, intake forms, playbook viewer |
| Backend engineer(s) | API, orchestration, database |
| AI/ML engineer(s) | Agent prompts, structured schemas, image-generation integration |
| Data engineer (part-time OK) | Curated data layer, Geo-Intelligence pipeline |
| QA (can be shared) | Test fixtures, regression suite, E2E |

For a 3 to 4 person hackathon team: one person on map/frontend, one on orchestration/backend, and one or two on agents, prompts, and data.

---

## 17. Evaluation Plan

Because no exact base paper exists for the complete combination (Section 19), the project defines its own contribution: **retrieval-grounded, multi-agent, product-driven location recommendation and per-location adaptation, with an explicit confidence and compliance layer.**

### 17.1 Main experiment: with RAG vs. without RAG

1. Select **10 to 15 test products** with known market outcomes.
2. Run the system **with RAG** and a **plain LLM baseline** without retrieval.
3. Measure:
   - how many recommended locations match markets where similar products actually succeeded
   - how many suggested modifications match what successful products actually did
   - groundedness: the share of claims supported by cited sources
   - **channel-price groundedness:** the share of channel prices backed by a valid cited comparable (target: 100%)
4. Have **3 to 5 domain reviewers** rate relevance, groundedness, and usefulness.
5. Report the difference. This answers the question "why is this better than a plain LLM?"

### 17.2 Component tests

| Test | Purpose |
|---|---|
| Unit | Per-agent schema validation and fallback logic |
| Integration | Full pipeline with mocked external APIs |
| Contract | Agent output schemas at every hand-off |
| Retrieval quality | Retrieved chunks are relevant and correctly scoped (10+ query pairs) |
| Schema conformance | Every agent output matches its schema on fixed fixtures |
| Fallback | Empty curated data leads to web-search fallback and lower confidence |
| Step cap | Loops always terminate and Finalize still runs |
| Consistency | Similar inputs produce similar scores and rankings |
| Explainability | The rationale actually justifies the score |
| Prompt regression | Fixed fixture pairs and snapshot comparison after prompt or model changes |
| Channel pricing rule | No price emitted without a source URL; `null` + `confidence: low` when no comparable is found; `medium`/`high` always carry non-empty `evidence_sources` |
| Full pipeline | 10 to 15 realistic cases re-run whenever an agent changes |
| UI / E2E | Map click-to-chip, multi-select, pin filters, playbook rendering |
| Load | Concurrent jobs, queue backpressure, timeouts |
| Compliance review | Manual pass on generated content before any public demo |

### 17.3 Diagnosing failures

| Symptom | Likely cause | Where to fix |
|---|---|---|
| Retrieved chunks are irrelevant | Chunking, metadata, or embedding model | Ingestion, not agent prompts |
| Chunks are right but the conclusion is wrong | Prompt or schema | Agent prompt or schema, not the vector DB |
| Guesses marked "high confidence" | Weak autonomous-mode instruction | Tighten the confidence rules |
| Downstream agent errors | Schema drift | Re-check contracts and validate at each hand-off |
| Channel price has no source or looks invented | Weak enforcement of the hard rule | Validate `evidence_sources` at Finalize; reject and retry, or force `confidence: low` |

---

## 18. Responsible Use, Limitations and Risks

### 18.1 Stated limitations

- The **market fit score** is based on analogs and proxy signals. It is **not a sales prediction**.
- **Compliance output is flagging** from a curated rules set. It is **not legal validation**.
- Confidence falls when evidence is thin, and the playbook says so.
- Curated data is strongest in the demo markets. Coverage per market is shown to the user, and "real-time" is not claimed where data is curated.
- Generated visuals and text must be reviewed by a person before any public use.
- **Channel prices** are evidence-based recommendations from public comparables, not guaranteed achievable prices; channels with no comparable are flagged low-confidence.

### 18.2 Risk register

| Risk | Mitigation |
|---|---|
| Image generation quality is inconsistent | Composite real logos and text; fall back to a design brief with no image; don't block the pipeline |
| Curated data is thin outside demo markets | Show data confidence and coverage; don't overclaim |
| LLM output drifts from the schema | Structured output plus schema validation and a repair retry |
| Ungrounded or invented claims | RAG with citations; grounding checks in evaluation |
| Cultural or compliance errors in generated content | Manual review gate before public demo; warning-based flags |
| Too few analogs for a market | Widen to neighboring market or category, state this, lower confidence |
| No real price comparable for a channel (e.g., hotels, cinemas) | Mark `confidence: low`, leave price `null` or flagged, never fabricate |
| Web-sourced prices outdated or unrepresentative | Show source and retrieval date, prefer recent sources, lower confidence for older data |
| Pipeline latency | Parallelize agents, show incremental progress, cache live-tool results |
| Cost growth from LLM, image, search, and map calls | Cache per market (and per market + channel), cap agent loops, monitor cost per job from day one |
| Privacy of uploaded brand assets and product images | Private storage, signed URLs, encryption, minimal data collection |
| Secrets exposure | Environment-based secret store; never commit API keys |

---

## 19. Prior Art Check (IEEE)

No exact IEEE base paper exists for Prodapt's complete combination (market expansion + cultural analysis + product adaptation + location recommendation in one system). Closest related work:

- *Current State, Potentials and Challenges for the Use of AI in the Early Phase of Product Development* (IEEE IEEM 2024): related but not an exact match.
- *AI and Consumer Behavior: Innovations in Marketing Strategy and Consumer Engagement* (IEEE ICCCNT 2024): related but not an exact match.

**Conclusion:** this project should not be described as an implementation of an existing IEEE base paper. The closest papers are research foundations; the project must state its own research gap and contribution (the contribution statement in Section 17). Verify the citations above against the original IEEE Xplore entries before using them in a report or paper.

---

## 20. Users, Market and Business Model

### 20.1 Target users

- MSMEs and startups expanding within India (for example, Tamil Nadu to Telangana, Karnataka, or Maharashtra)
- Companies pursuing international expansion (for example, the Middle East or Southeast Asia)
- Enterprises, retailers, FMCG brands, and franchises entering new regions
- Government trade-promotion bodies, export facilitation agencies, and business incubators supporting MSME export-readiness

### 20.2 Benefits

- Saves time compared with manual research
- Reduces the cost of hiring consultants
- Lowers the risk of product failure in new markets
- Helps small businesses compete with larger ones
- Gives clear, ready-to-use plans for launching in new places

### 20.3 Market potential

- India has an estimated 6.3+ crore MSMEs, many aiming to scale beyond their home state or export, but most lack resources for dedicated market-research or localization teams. (Confirm the latest figure from official MSME sources before citing it in a report.)
- The market research and business consulting industry is very large, and AI-driven localization and adaptation is an emerging, largely untapped niche.

### 20.4 Revenue models

Tiered SaaS subscriptions, pay-per-report pricing, and enterprise licensing for large retailers, FMCG companies, and franchise brands.

---

## 21. AI/ML Domain Mapping

| Technique | Where it is used |
|---|---|
| Large Language Models | Reasoning in every agent, gap analysis, structured generation |
| RAG | Grounded retrieval from the culture/regulation and product-success knowledge bases, with citations |
| Embeddings and vector similarity search | Finding similar products (analogs) and relevant knowledge chunks |
| Multi-agent orchestration | Ten specialized agents with structured hand-offs, parallel steps, scoped re-runs |
| Generative image models | Brand-conditioned packaging, poster, and UI mockups |
| Multimodal understanding | Reading brand assets and product photos, and checking generated visuals against guidelines |
| Geospatial analysis | Competitor density and footfall-zone scoring on map data |
| Explainable scoring | Weighted fit score with a visible breakdown and confidence levels |
| Evidence-grounded price recommendation | Per-channel pricing from cited web comparables |

---

## 22. Glossary and FAQ

### 22.1 Glossary

| Term | Meaning |
|---|---|
| **LLM** | Large Language Model; an AI model that reads and writes text |
| **RAG** | Retrieval-Augmented Generation; the model retrieves relevant documents first and answers from them |
| **Embedding** | A numeric representation of text that captures meaning, so similar items are close together |
| **Vector database** | A database that stores embeddings and finds the most similar ones quickly |
| **Metadata filtering** | Narrowing a search by tags (for example, state or category) before ranking by similarity |
| **Analog** | A similar product that has already succeeded in the target market |
| **Proxy signal** | An indirect measure of success (ratings, reviews, search trends) used when sales data is not public |
| **RAP** | Reason, Act, Plan; the pattern each agent follows |
| **Agent** | An LLM-driven component with a defined role, tools, and output schema |
| **Structured output** | Model output forced into a fixed JSON schema |
| **Autonomous mode** | The pipeline runs end to end without asking the user questions |
| **Scoped re-run** | Re-running one agent while keeping other outputs fixed |
| **Footfall** | The amount of foot traffic in an area |
| **Fit score** | A weighted, explainable measure of how well a location suits the product |
| **Sales channel** | The type of outlet a product is sold through (retail, modern trade, captive/convenience, hospitality, online, bulk), each with its own price logic |
| **Comparable** | A real, cited price for a similar product in a given channel, used as evidence for a price recommendation |
| **Hard / Soft / Idea product** | Physical product / digital product / not-yet-built concept; determines what intake data and images are collected |
| **AI Copilot** | A conversational interface that lets users ask questions about Prodapt results and trigger supported actions using grounded project data |

### 22.2 FAQ

**Does Prodapt predict sales?**
No. It produces a market fit score based on similar successful products and visible evidence, and it reports its confidence honestly.

**Where does the "success" data come from if sales data is private?**
From proxy signals such as ratings, review counts, search-interest trends, open product datasets, and published coverage of top-selling products, all cited.

**What if the user already knows where to launch?**
They select markets on the map. The pipeline then skips recommendation and adapts the product for those locations directly.

**What if there isn't enough data for a market?**
The agent widens its search, uses web search as a fallback, lowers its confidence, and states the gap in the playbook.

**Is the compliance check legally binding?**
No. It flags likely issues from a curated rules set. Businesses should confirm with qualified professionals.

**Why use analogs instead of a machine-learning sales model?**
Reliable sales data is not publicly available. Analogs are verifiable, explainable, and produce concrete actions.

**Why does the same product get different prices within one city?**
Because the channel changes the cost structure and customer expectation (for example, ₹10 at a kirana vs. ₹30 at a cinema vs. ₹200 at a 5-star hotel). Prodapt recommends a price per channel, each backed by a cited comparable.

**What if no comparable price can be found for a channel?**
The channel is marked `confidence: low` with an explicit note. Prodapt does not guess a number.

**What if the product is only an idea, or has no photos?**
Idea-stage products are supported with text-only input; visual outputs are labelled "concept visualization" and visual confidence is lowered. Missing product photos never block the pipeline.

---

## 23. UI Design Reference

A clickable prototype covering Product Intake (with map selection), Agent Pipeline status, the Expansion Playbook, and the Recommended Locations map was built separately during planning. Prototype link: _add link here_.

Before it is treated as final, the prototype should be updated to reflect:
- the corrected 10-agent flow
- the location-*recommendation* step (not only adaptation of a pre-chosen market)
- the product-type selector and multi-angle image upload at intake
- the per-channel price matrix and channel sales strategy in the Playbook
- the **Prodapt AI Copilot / Conversational Expansion Assistant** with context-aware chat, grounded answers, evidence display, and supported actions

---

## 24. Documentation Index, Team, License

### 24.1 Documentation index

| File | Contents |
|---|---|
| `Prodapt_Build_Guide.md` | Phase-by-phase build guide for all agents and the playbook |
| `Prodapt_SDLC_Development_Guide.md` | SDLC model, architecture, schema, API design, sprints, testing, risks |
| `Prodapt_Building_an_Agent_with_RAP_Model.md` | How to build and test a single agent using the RAP pattern |
| `Prodapt_Technology_and_Tools_Stack.md` | Full tools breakdown with alternatives |
| `Prodapt_Tool_Stack.pdf` | Definitive tool selection |
| `IEEE_Base_Paper_Existence_Check.pdf` | Related IEEE research and the research-gap note |
| This document | Consolidated master reference; supersedes conflicts in the files above |

> **Note:** the Build Guide, SDLC Guide, and RAP guide predate the Product Profiler, Location Recommender, and Success-Analog Advisor (which replaces the earlier Sales Forecaster), the product-type-aware intake, and the channel pricing capability. They should be updated to match this document.

### 24.2 Team

**JKKN Institutions:** Harish S G (731323205020), Jaisin G (731323205023), Pruthweesh NV (731323205042), Sridharan K (731323205051)

Project Guide: _add name here_

### 24.3 License

_Add your license here._
