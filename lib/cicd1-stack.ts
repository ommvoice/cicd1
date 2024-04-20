import * as cdk from 'aws-cdk-lib';
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './PipelineStage';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Cicd1Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('ommvoice/cicd1', 'master'), //Remember to change
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    const testingStage = pipeline.addStage(
      new PipelineStage(this, 'test', {
        env: { account: '664876795774', region: 'eu-west-3' },
      })
    );

    testingStage.addPre(
      new CodeBuildStep('unit-tests', {
        commands: ['npm ci', 'npm run test'],
      })
    );
  }
}
