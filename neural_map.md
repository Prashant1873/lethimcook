# Neural Map: LunaTick

```mermaid
flowchart TD
    A[Respondent Opens Webpage] --> B[Display Clean Blind Test UI]
    B --> C["Prompt: 'This is a test please trust me and answer'"]
    C --> D[Input: Name]
    D --> E[Select: Mood Cards]
    
    subgraph Client-Side Secret Calculation
        F[Current Date & Time] --> G[Astronomical Lunar Phase Calculator]
        G --> H[Determine Moon Phase & Illumination %]
    end
    
    E & H & D --> I[Form Submission]
    
    subgraph Data Sink
        I --> J[HTTP POST / Webhook]
        J --> K[Google Apps Script Web App / Sheet Connector]
        K --> L[(Google Sheet)]
        L --> M["Columns: Date | Moon Phase | Illumination % | Name | Mood"]
    end
    
    I --> N[Gentle Thank You / Confirmation Screen]
```

### Logical Nodes
1. **Frontend Presentation Layer**: Minimalist, distraction-free questionnaire. Pure blind prompt. No lunar references visible to the user.
2. **Lunar Calculation Engine**: Deterministic astronomical calculation based on Julian date or synodic lunar cycle (29.53058867 days) since a known new moon epoch. Runs purely client-side without external dependencies.
3. **Data Dispatcher**: Submits payload `{ timestamp, moonPhase, moonPhaseDetail, name, mood }` via lightweight POST request to the Google Sheet backend.
4. **Backend Ingestion Layer**: Google Apps Script web app endpoint that receives JSON/URL-encoded payload and appends a row to the configured Google Sheet.
