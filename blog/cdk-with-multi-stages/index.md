---
title: CDK best practice to deploy multi stages with each configuration.
description: Best way to split resources and handle configuration. 
date: 2023-07-25T01:05:00+09:00
categories: [AWS,CDK,Typescript]
keywords: [cdk,deploy]
---
## What is CDK? (for beginner)
CDK is for deploying AWS resources with familiar programming languages like typescript, go, java, .NET and python. It actually is a wrapper of cloudformation and it generates cloudformation as intermediate output. CDK is very handy, useful and self-documented, compared to creating resources with aws console or cloudformation.


CDK offers support type for aws resources and 3 types of abstraction, called L1, L2, L3 (L stands for layer). L1 is the lowest level and you must explicitly configure properties. L2 incorporates the defaults, boilerplate, so you can lessen code.
In this blog, I use L2 for CDK and coding with typescript.


For people not familiar with CDK, here's my sample code representing an EC2 instance in a public subnet deploying multi-AZ. You will see the power of CDK enables you write less code than cloudformation.




![AWS Resources image](https://moritakuaki.com/__blogs__/cdk-with-multi-stages/images/cdk-sample.png)


```typescript
//lib.ts
export class VPCStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


    const vpc = new Vpc(this, "MyVPC", {
          maxAzs: 2,
          ipAddresses: IpAddresses.cidr("10.0.0.0/16"),
          subnetConfiguration: [
            {
              cidrMask: 24,
              subnetType: SubnetType.PUBLIC,
            },
          ],
        });


    new Instance(this, "BastionHostEC2", {
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
    })
  }
}


//bin/stack.ts
const app = new cdk.App({
  synth: true // if false you have to run `cdk synth` to outputs cloudformation before `cdk deploy`
});
new VPCStack(app, "VPCStack")
```


CDK does support CLI. Type `npm install -g cdk` to install CLI and then you can use boilerplate with running `cdk app init --language=typescript` , this command generate sample application. You need to run `cdk bootstrap aws://ACCOUNT-NUMBER/REGISON` for provisioning resources before the first deployment. After you build typescript, you can deploy with running `cdk deploy`.


Now it's an easy task to deploy resources. CDK's merits are
- You don't have to prepare detailed procedure manual
- Default parameters are incorporated so you write less code than cloudformation (L2 and L3)


Demerits are
- L2 or L3 do not support detailed configuration and some properties.


But demerits can be compensated. You can manually create resources and reference them within CDK.


## CDK Stages with different configuration
For every application, you would have to deploy not only a production stage but also a development stage. CDK prepares for multi stages deployment, and  `Stage` class is used to define the deployment stage. If you want to use a different VPC, you only have to modify code like here.


```typescript
const app = new cdk.App({
  synth: true
})
//stages definition
const prod = new cdk.Stage(app,"prod")
const dev = new cdk.Stage(app, "dev")


new VPCStack(dev,"VPCStack")
new VPCStack(test,"VPCStack")
```
After running `npm run build` and `cdk deploy` 2 stacks are created. Each stack's name is dev/VPCStack`, `test/VPCStack` and `prod/VPCStack`.


If you actually try, you will fail to deploy resources. But why? Because VPC CIDR blocks `10.0.0.0/16` are
collided between each stage. You have to separate VPC CIDR blocks between each stage. But how to make it?
I'll show you 2 examples of how to solve it.


#### 1. Using CDK context


Context is a handly way to use key-value pairs, and can be referenced in CDK stacks. You can supply context in multiple ways.
- cdk deploy --context key1=value1 --context key2=value2
- context key of cdk.json
- context key of cdk.context.json


so using context key cdk.json here.
```json
// cdk.json
{
  //...
  context:{
    "dev":{
      "cidr": "10.0.0.0/16"
    },
    "prod":{
      "cidr": "10.1.0.0/16"
    }
  }
}
```
and reference it within CDK by stage key.
```typescript
//lib.ts
export class VPCStack extends Stack {
  constructor(stage: Stage, id: string, props?: StackProps) {
    super(stage, id, props);
    //Get context here!
    const cidr = stage.node.tryGetContext(stage.stageName)["cidr"]  


    const vpc = new Vpc(this, "MyVPC", {
              maxAzs: 2,
              ipAddresses: IpAddresses.cidr(cidr),
              subnetConfiguration: [
                {
                  cidrMask: 24,
                  subnetType: SubnetType.PUBLIC,
                },
              ],
            });


    //...
  }
}
```
```typescript
//bin/stack.ts
const app = new cdk.App({
  synth: true
})
const prod = new cdk.Stage(app,"prod")    //"10.1.0.0/16"
const dev = new cdk.Stage(app, "dev")     //"10.0.0.0/16"
new VPCStack(dev,"VPCStack")  //stack name dev/VPCStack
new VPCStack(test,"VPCStack") //stack name prod/VPCStack


```
Of course you can add more properties like EC2 type, subnet type, anything that is represented by json value.
It's easy, but I don't actually use this method for 2 reasons.


- You cannot define a property's type. Cidr must be string but you have to look at cdk.json carefully.
- Each stage possibly has different properties.


So I prefer to use the next method which I'll explain.


*Official reference here [Runtime context](https://docs.aws.amazon.com/cdk/v2/guide/context.html)


#### Write configuration in code (Recommend)
Let's think about the same situation before, we have to deploy a VPC with `prod` and `dev` with different CIDR blocks. Second option use function takes stage as argument and return configuration. I named `appContext` for example.
```typescript


export const appContext = (stage:cdk.Stage):AppPorps =>{
  const stage = stage.node.getContext("stage") as 'dev'|'prod';
  return {
    stage,
    vpc:{
      cidr: stage === 'dev' ? "10.0.0.0/16" : "10.1.0.0/16"
    },
  }
}


type Approps = {
  stage: string,
  vpc:{
    cidr: string
  },
}
```
And simply VPCStack call this function like this.
```typescript
export class VPCStack extends Stack {
  constructor(stage: Stage, id: string, props?: StackProps) {
    super(stage, id, props);
    //called here
    const {vpc} = appContext(this)
   
    new Vpc(this, "MyVPC", {
              maxAzs: 2,
              ipAddresses: IpAddresses.cidr(vpc.cidr),
              subnetConfiguration: [
                {
                  cidrMask: 24,
                  subnetType: SubnetType.PUBLIC,
                },
              ],
            });


    //...
  }
}
```
Code changed slightly but we got 2 advantages.
- Define the type of resource properties.
- Each stage has the same property type.


Then we only have to pass `stage` as context when running `cdk deploy --context stage="dev"` or `--context stage="prod"`. You don't need to write complex contexts in cdk.json anymore!


That's all for this blog. If you are using CDK try this way. Thank you for reading!



