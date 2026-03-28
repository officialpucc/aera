#!/bin/bash

# Script to create GitHub issues from Aera backlog
# Requires GitHub CLI (gh) to be installed and authenticated

# Epics
gh issue create --title "[Epic 1] The Central Cortex" --body "Core reasoning and memory system for Aera." --label "epic"
gh issue create --title "[Epic 2] Sensory Dendrites" --body "Data ingestion pathways for real-time operations." --label "epic"
gh issue create --title "[Epic 3] Predictive Motor Output" --body "Action loop and predictive modeling." --label "epic"

# Sprint 1 Tasks
gh issue create --title "A-001: Implement Aera Core (Node.js/TS)" --body "Implement core reasoning with singular context management." --label "sprint-1","task"
gh issue create --title "A-002: Create Perforated Data Ingestion Interface" --body "Develop the Dendrite SDK for data pathways." --label "sprint-1","task"
gh issue create --title "A-003: Develop Supply Chain Dendrite" --body "Build Porte simulation and inventory logic." --label "sprint-1","task"
gh issue create --title "A-004: Implement Action Proposal system" --body "Notification loop for user approval." --label "sprint-1","task"
gh issue create --title "A-005: Build Financial Ledger Dendrite" --body "Basic COGS and Revenue tracking." --label "sprint-1","task"

echo "All issues created successfully."
