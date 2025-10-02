#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { OnprtyCdkStack } from '../lib/onprty-cdk-stack';
import * as dotenv from 'dotenv';
dotenv.config();

const app = new cdk.App();
new OnprtyCdkStack(app, 'OnprtyCDKStack', {
  domainName: 'vberkoz.com',
  subdomain: 'onprty',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});