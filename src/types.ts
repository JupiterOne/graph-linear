import {
  ExecutionContext,
  Step,
  StepExecutionContext,
} from '@jupiterone/integration-sdk-core';

export type JupiterOneExecutionContext = ExecutionContext & {
  accountId: string;
};

export type JupiterOneStepExecutionContext = JupiterOneExecutionContext &
  StepExecutionContext;
export type JupiterOneStep = Step<JupiterOneStepExecutionContext>;
