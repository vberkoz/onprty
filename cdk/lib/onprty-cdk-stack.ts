// cdk/lib/onprty-cdk-stack.ts

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'path';

interface OnprtyCDKStackProps extends cdk.StackProps {
  domainName: string;
  subdomain: string;
  env: {
    account: string | undefined;
    region: string | undefined;
  };
}


export class OnprtyCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: OnprtyCDKStackProps) {
    super(scope, id, props);
    
    const domain = `${props.subdomain}.${props.domainName}`;
    const COGNITO_REDIRECT_URI = `https://${domain}/auth-callback`;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error("Missing environment variables: GOOGLE_CLIENT_ID and/or GOOGLE_CLIENT_SECRET must be set.");
    }

    const hostedZone = 
    cdk.aws_route53.HostedZone.fromLookup(this, 'OnprtyCDKStackZone', {
      domainName: props.domainName,
    });

    const cert = 
    new cdk.aws_certificatemanager.Certificate(this, 'OnprtyCDKStackCert', {
      domainName: domain,
      validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    const bucket = 
    new cdk.aws_s3.Bucket(this, 'OnprtyCDKStackBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      publicReadAccess: false,
    });

    const oai = new cdk.aws_cloudfront.OriginAccessIdentity(this, 'OnprtyCDKStackOAI');
    bucket.grantRead(oai);

    const cfFunction = 
    new cdk.aws_cloudfront.Function(this, 'OnprtyCDKStackIndexHtmlFunction', {
      code: cdk.aws_cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          var uri = request.uri;

          if (uri.endsWith("/")) {
            request.uri += "index.html";
          } else if (!uri.includes(".")) {
            request.uri += "/index.html";
          }

          return request;
        }
      `),
    });

    const distribution = 
    new cdk.aws_cloudfront.Distribution(this, 'OnprtyCDKStackDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: cdk.aws_cloudfront_origins.S3BucketOrigin.withOriginAccessIdentity(bucket, {
          originAccessIdentity: oai,
        }),
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [{
          function: cfFunction,
          eventType: cdk.aws_cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
      domainNames: [domain],
      certificate: cert,
      errorResponses: [
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.minutes(5) },
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.minutes(5) },
      ],
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, 'OnprtyCDKStackBucketDeployment', {
      sources: [
        cdk.aws_s3_deployment.Source.asset(path.join(process.cwd(), '../dist')),
      ],
      destinationBucket: bucket,
      distributionPaths: ['/*'],
      distribution,
    });

    new cdk.aws_route53.ARecord(this, 'OnprtyCDKStackAliasRecord', {
      zone: hostedZone,
      recordName: props.subdomain,
      target: cdk.aws_route53.RecordTarget.fromAlias(new cdk.aws_route53_targets.CloudFrontTarget(distribution)),
    });

    const userPool = 
    new cdk.aws_cognito.UserPool(this, 'OnprtyCDKStackUserPool', {
      signInAliases: { email: true },
      selfSignUpEnabled: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      standardAttributes: {
        email: { required: true, mutable: true },
      },
      userPoolName: 'OnprtyUserPool',
    });

    const googleProvider = 
    new cdk.aws_cognito.UserPoolIdentityProviderGoogle(this, 'OnprtyGoogleProvider', {
      userPool,
      clientId: GOOGLE_CLIENT_ID,
      clientSecretValue: cdk.SecretValue.unsafePlainText(GOOGLE_CLIENT_SECRET),
      scopes: ['profile', 'email', 'openid'],
      attributeMapping: {
        email: cdk.aws_cognito.ProviderAttribute.GOOGLE_EMAIL,
        givenName: cdk.aws_cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
        familyName: cdk.aws_cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
        profilePicture: cdk.aws_cognito.ProviderAttribute.GOOGLE_PICTURE,
      },
    });

    const cognitoCert = 
    new cdk.aws_certificatemanager.Certificate(this, 'OnprtyCognitoCustomDomainCertificate', {
      domainName: `auth.${domain}`,
      validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    const publicSitesCert = 
    new cdk.aws_certificatemanager.Certificate(this, 'OnprtyPublicSitesCertificate', {
      domainName: `sites.${domain}`,
      validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    const userPoolDomain =
    userPool.addDomain('OnprtyUserPoolDomain', {
      customDomain: {
        domainName: `auth.${domain}`,
        certificate: cognitoCert,
      },
    });
    
    const cognitoAliasRecord =
    new cdk.aws_route53.ARecord(this, 'OnprtyCognitoCustomDomainAliasRecord', {
      zone: hostedZone,
      recordName: `auth.${domain}`,
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.UserPoolDomainTarget(userPoolDomain)
      ),
    });

    cognitoAliasRecord.node.addDependency(userPoolDomain);

    const userPoolClient =
    userPool.addClient('OnprtyAppClient', {
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        scopes: [
          cdk.aws_cognito.OAuthScope.OPENID,
          cdk.aws_cognito.OAuthScope.EMAIL,
          cdk.aws_cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: [COGNITO_REDIRECT_URI, 'http://localhost:5173/auth-callback'],
        logoutUrls: [`https://${domain}`, 'http://localhost:5173'],
      },
      supportedIdentityProviders: [
        cdk.aws_cognito.UserPoolClientIdentityProvider.GOOGLE,
      ],
      preventUserExistenceErrors: true,
    });

    userPoolClient.node.addDependency(googleProvider);

    // DynamoDB table for site schemas
    const sitesTable = new cdk.aws_dynamodb.Table(this, 'OnprtySitesTable', {
      tableName: 'onprty-sites',
      partitionKey: { name: 'userId', type: cdk.aws_dynamodb.AttributeType.STRING },
      sortKey: { name: 'siteId', type: cdk.aws_dynamodb.AttributeType.STRING },
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // S3 Bucket for published sites (public)
    const publicSitesBucket = new cdk.aws_s3.Bucket(this, 'OnprtyPublicSitesBucket', {
      bucketName: `onprty-public-sites-${this.account}-${this.region}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: true,
      blockPublicAccess: new cdk.aws_s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      websiteIndexDocument: 'index.html',
    });

    // CloudFront function for public sites
    const publicSitesCfFunction = new cdk.aws_cloudfront.Function(this, 'OnprtyPublicSitesIndexHtmlFunction', {
      code: cdk.aws_cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          var uri = request.uri;

          if (uri.endsWith("/")) {
            request.uri += "index.html";
          } else if (!uri.includes(".")) {
            request.uri += "/index.html";
          }

          return request;
        }
      `),
    });

    // CloudFront distribution for public sites
    const publicSitesDistribution = new cdk.aws_cloudfront.Distribution(this, 'OnprtyPublicSitesDistribution', {
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3StaticWebsiteOrigin(publicSitesBucket),
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [{
          function: publicSitesCfFunction,
          eventType: cdk.aws_cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
      domainNames: [`sites.${domain}`],
      certificate: publicSitesCert,
    });

    new cdk.aws_route53.ARecord(this, 'OnprtyPublicSitesAliasRecord', {
      zone: hostedZone,
      recordName: `sites.${domain}`,
      target: cdk.aws_route53.RecordTarget.fromAlias(new cdk.aws_route53_targets.CloudFrontTarget(publicSitesDistribution)),
    });

    // Site Generator API Lambda
    const apiLambda = new cdk.aws_lambda.Function(this, 'OnprtyApiLambda', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
      handler: 'lambda.handler',
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, '../api')),
      timeout: cdk.Duration.seconds(30),
      environment: {
        NODE_ENV: 'production',
        SITES_TABLE_NAME: sitesTable.tableName,
        PUBLIC_SITES_BUCKET_NAME: publicSitesBucket.bucketName,
        PUBLIC_DOMAIN: `sites.${domain}`,
        CLOUDFRONT_DISTRIBUTION_ID: publicSitesDistribution.distributionId,
        COGNITO_USER_POOL_ID: userPool.userPoolId,
        COGNITO_CLIENT_ID: userPoolClient.userPoolClientId,
      },
    });

    apiLambda.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: [
          'bedrock:InvokeModel',
          'bedrock:InvokeModelWithResponseStream',
        ],
        resources: ['*'],
      })
    );

    sitesTable.grantReadWriteData(apiLambda);
    publicSitesBucket.grantReadWrite(apiLambda);
    
    apiLambda.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ['cloudfront:CreateInvalidation'],
        resources: [`arn:aws:cloudfront::${this.account}:distribution/${publicSitesDistribution.distributionId}`],
      })
    );

    // API Gateway
    const api = new cdk.aws_apigatewayv2.HttpApi(this, 'OnprtyApi', {
      apiName: 'onprty-api',
      createDefaultStage: false,
      corsPreflight: {
        allowHeaders: ['*'],
        allowMethods: [cdk.aws_apigatewayv2.CorsHttpMethod.ANY],
        allowOrigins: ['*'],
      },
    });

    const lambdaIntegration = new cdk.aws_apigatewayv2_integrations.HttpLambdaIntegration(
      'OnprtyLambdaIntegration',
      apiLambda
    );

    api.addRoutes({
      path: '/generate',
      methods: [cdk.aws_apigatewayv2.HttpMethod.POST],
      integration: lambdaIntegration,
    });

    api.addRoutes({
      path: '/sites',
      methods: [cdk.aws_apigatewayv2.HttpMethod.GET, cdk.aws_apigatewayv2.HttpMethod.POST],
      integration: lambdaIntegration,
    });

    api.addRoutes({
      path: '/sites/{id}',
      methods: [cdk.aws_apigatewayv2.HttpMethod.GET, cdk.aws_apigatewayv2.HttpMethod.PUT, cdk.aws_apigatewayv2.HttpMethod.DELETE],
      integration: lambdaIntegration,
    });

    api.addRoutes({
      path: '/sites/{id}/publish',
      methods: [cdk.aws_apigatewayv2.HttpMethod.POST],
      integration: lambdaIntegration,
    });

    api.addRoutes({
      path: '/sites/{id}/unpublish',
      methods: [cdk.aws_apigatewayv2.HttpMethod.POST],
      integration: lambdaIntegration,
    });

    new cdk.aws_apigatewayv2.CfnStage(this, 'OnprtyApiRateLimitedStage', {
      apiId: api.apiId,
      stageName: '$default',
      autoDeploy: true,
      defaultRouteSettings: {
        throttlingBurstLimit: 5,
        throttlingRateLimit: 10,
      },
    });

    new cdk.CfnOutput(this, 'OnprtyAppDomain', { value: `https://${domain}` });
    new cdk.CfnOutput(this, 'OnprtyUserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'OnprtyUserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'OnprtyCognitoDomain', {
      value: `https://auth.${domain}`,
    });
    new cdk.CfnOutput(this, 'OnprtyApiUrl', {
      value: api.apiEndpoint,
      description: 'API Gateway URL for site generation',
    });
    new cdk.CfnOutput(this, 'OnprtySitesTableName', {
      value: sitesTable.tableName,
      description: 'DynamoDB table for site schemas',
    });
    new cdk.CfnOutput(this, 'OnprtyPublicSitesDomain', {
      value: `https://${publicSitesDistribution.distributionDomainName}`,
      description: 'CloudFront domain for published sites',
    });
  }
}
