/*Copyright 2019 Evsent

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/


linkRequirments = {
    EiffelActivityCanceledEvent: {
        ACTIVITY_EXECUTION: {
            required: true,
            legal_targets: ["EiffelActivityTriggeredEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }

    },

    EiffelActivityFinishedEvent: {
        ACTIVITY_EXECUTION: {
            required: true,
            legal_targets: ["EiffelActivityTriggeredEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelActivityStartedEvent: {
        ACTIVITY_EXECUTION: {
            required: true,
            legal_targets: ["EiffelActivityTriggeredEvent"],
            multiple_allowed: false
        },
        PREVIOUS_ACTIVITY_EXECUTION: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelActivityTriggeredEvent: {
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelAnnouncementPublishedEvent: {
        MODIFIED_ANNOUNCEMENT: {
            required: false,
            legal_targets: ["EiffelAnnouncementPublishedEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    }, 
    EiffelArtifactCreatedEvent: {
        COMPOSITION: {
            required: false,
            legal_targets: ["EiffelCompositionDefinedEvent"],
            multiple_allowed: false
        },
        ENVIRONMENT: {
            required: false,
            legal_targets: ["EiffelEnvironmentDefinedEvent"],
            multiple_allowed: false
        },
        PREVIOUS_VERSION: {
            required: false,
            legal_targets: ["EiffelArtifactCreatedEvent"],
            multiple_allowed: true
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelArtifactPublishedEvent: {
        ARTIFACT: {
            required: true,
            legal_targets: ["EiffelArtifactCreatedEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }

    },
    EiffelArtifactReusedEvent: {
        COMPOSITION: {
            required: true,
            legal_targets: ["EiffelCompositionDefinedEvent"],
            multiple_allowed: false
        },
        REUSED_ARTIFACT: {
            required: true,
            legal_targets: ["EiffelArtifactCreatedEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelCompositionDefinedEvent: {
        ELEMENT:{
            required: false,
            legal_targets: ["EiffelCompositionDefinedEvent",
            "EiffelSourceChangeSubmittedEvent",
            "EiffelArtifactCreatedEvent"],
            multiple_allowed: true
        },
        PREVIOUS_VERSION: {
            required: false,
            legal_targets: ["EiffelCompositionDefinedEvent"],
            multiple_allowed: true
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }

    },
    EiffelConfidenceLevelModifiedEvent: {
        SUBJECT: {
            required: true,
            legal_targets: ["EiffelCompositionDefinedEvent",
            "EiffelArtifactCreatedEvent",
            "EiffelSourceChangeCreatedEvent",
            "EiffelSourceChangeSubmittedEvent"],
            multiple_allowed: true
        },        
        SUB_CONFIDENCE_LEVEL: {
            required: false,
            legal_targets: ["EiffelConfidenceLevelModifiedEvent"],
            multiple_allowed: true
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelEnvironmentDefinedEvent: {
        PREVIOUS_VERSION: {
            required: false,
            legal_targets: ["EiffelEnvironmentDefinedEvent"],
            multiple_allowed: true
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelFlowContextDefinedEvent: {
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelIssueDefinedEvent: {
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelIssueVerifiedEvent: {
        SUCCESSFUL_ISSUE: {
            required: false,
            legal_targets: ["EiffelIssueDefinedEvent"],
            multiple_allowed: false
        },
        FAILED_ISSUE: {
            required: false,
            legal_targets: ["EiffelIssueDefinedEvent"],
            multiple_allowed: false
        },
        INCONCLUSIVE_ISSUE: {
            required: false,
            legal_targets: ["EiffelIssueDefinedEvent"],
            multiple_allowed: false
        },
        IUT: {
            required: true,
            legal_targets: ["EiffelArtifactCreatedEvent","EiffelCompositionDefinedEvent"],
            multiple_allowed: false
        },
        VERIFICATION_BASIS: {
            required: false,
            legal_targets: ["EiffelTestCaseFinishedEvent","EiffelTestSuiteFinishedEvent"],
            multiple_allowed: true
        },
        ENVIRONMENT: {
            required: false,
            legal_targets: ["EiffelEnvironmentDefinedEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelSourceChangeCreatedEvent: {
        BASE: {
            required: false,
            legal_targets: ["EiffelSourceChangeSubmittedEvent"],
            multiple_allowed: false
        },
        PREVIOUS_VERSION: {
            required: false,
            legal_targets: ["EiffelSourceChangeCreatedEvent"],
            multiple_allowed: true
        },
        PARTIALLY_RESOLVED_ISSUE: {
            required: false,
            legal_targets: ["EiffelIssueDefinedEvent"],
            multiple_allowed: true
        },
        RESOLVED_ISSUE: {
            required: false,
            legal_targets: ["EiffelIssueDefinedEvent"],
            multiple_allowed: true
        },
        DERESOLVED_ISSUE: {
            required: false,
            legal_targets: ["EiffelIssueDefinedEvent"],
            multiple_allowed: true
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelSourceChangeSubmittedEvent : {
        CHANGE: {
            required: false,
            legal_targets: ["EiffelSourceChangeCreatedEvent"],
            multiple_allowed: false
        },
        PREVIOUS_VERSION: {
            required: false,
            legal_targets: ["EiffelSourceChangeCreatedEvent"],
            multiple_allowed: true
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelTestCaseCanceledEvent:{
        TEST_CASE_EXECUTION: {
            required: true,
            legal_targets: ["EiffelTestCaseTriggeredEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelTestCaseFinishedEvent: {
        TEST_CASE_EXECUTION: {
            required: true,
            legal_targets: ["EiffelTestCaseTriggeredEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelTestCaseStartedEvent: {
        TEST_CASE_EXECUTION: {
            required: true,
            legal_targets: ["EiffelTestCaseTriggeredEvent"],
            multiple_allowed: false
        },
        ENVIRONMENT: {
            required: false,
            legal_targets: ["EiffelEnvironmentDefinedEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelTestCaseTriggeredEvent: {
        IUT: {
            required: true,
            legal_targets: ["EiffelArtifactCreatedEvent","EiffelCompositionDefinedEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelTestExecutionRecipeCollectionCreatedEvent: {
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelTestSuiteFinishedEvent: {
       
        TEST_SUITE_EXECUTION: {
            required: true,
            legal_targets: ["EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    },
    EiffelTestSuiteStartedEvent: {
        TERC: {
            required: false,
            legal_targets: ["EiffelTestExecutionRecipeCollectionCreatedEvent"],
            multiple_allowed: false
        },
        CAUSE: {
            required: false,
            legal_targets: "any",
            multiple_allowed: true
        },
        CONTEXT: {
            required: false,
            legal_targets: ["EiffelActivityTriggeredEvent", "EiffelTestSuiteStartedEvent"],
            multiple_allowed: false
        },
        FLOW_CONTEXT: {
            required: false,
            legal_targets: ["EiffelFlowContextDefinedEvent"],
            multiple_allowed: true
        }
    }
}


exports = { linkRequirments }