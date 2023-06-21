import { RemovalPolicy } from "aws-cdk-lib";
import {
  IVpc,
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  SubnetSelection,
} from "aws-cdk-lib/aws-ec2";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  DatabaseProxy,
  DatabaseSecret,
  MysqlEngineVersion,
} from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import { appContext } from "../../bin/config";

interface VpcProps {
  vpc: IVpc;
  subnets: SubnetSelection;
}

export class RDSWithProxy extends Construct {
  public readonly dbSecret: DatabaseSecret;
  public readonly proxy: DatabaseProxy;
  public readonly databaseName: string;

  constructor(scope: Construct, id: string, props: VpcProps) {
    super(scope, id);

    const { rds } = appContext(this);
    this.databaseName = rds.databaseName;

    this.dbSecret = new DatabaseSecret(this, "RDSSecret", {
      username: "admin",      
    });

    const dbInstance = new DatabaseInstance(this, "rds", {
      engine: DatabaseInstanceEngine.mysql({
        version: MysqlEngineVersion.VER_8_0_28,
      }),
      credentials: Credentials.fromSecret(this.dbSecret),
      vpc: props.vpc,
      databaseName: this.databaseName,
      vpcSubnets: props.subnets,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      iamAuthentication: rds.iamAuthentication,
      removalPolicy: RemovalPolicy.DESTROY,      
    });

    const proxySG = new SecurityGroup(this, "RDSProxySG", props);
    proxySG.addIngressRule(Peer.anyIpv4(), Port.tcp(3306));
    this.proxy = dbInstance.addProxy("RDSProxy", {
      vpc: props.vpc,
      requireTLS: false, //TODO: true when prod
      vpcSubnets: props.subnets,
      secrets: [this.dbSecret],
      securityGroups: [proxySG],
      debugLogging: true,
    });
  }
}
