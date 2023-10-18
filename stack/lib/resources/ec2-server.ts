import {
  ISecurityGroup,
  IVpc,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  SubnetType,
  UserData
} from "aws-cdk-lib/aws-ec2";
import {
  CfnInstanceProfile,
  ManagedPolicy,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class EC2Server extends Construct {
  public readonly ec2: Instance;
  
  constructor(scope: Construct, id: string, props:{vpc: IVpc,securityGroup: ISecurityGroup}) {
    super(scope, id);
    
    const role = new Role(this, "EC2AccessSSMRole", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
      ],
    });

    new CfnInstanceProfile(this, `SSMIntanceProfile`, {
      roles: [role.roleName],
    });

    //ssm is pre installed on amazon linux 2
    //so we only have to launch it
    const userData = UserData.forLinux();
    userData.addCommands(
      "sudo systemctl status amazon-ssm-agent",
      "sudo systemctl enable amazon-ssm-agent",
      "sudo systemctl start amazon-ssm-agent",
      "sudo yum install -y mysql"
    );

    this.ec2 = new Instance(this, "BastionHostEC2", {
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),      
      vpc:props.vpc,
      ssmSessionPermissions: true,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      machineImage: MachineImage.latestAmazonLinux2({
        userData,
      }),
      role,
      securityGroup:props.securityGroup 
    });
  }
}
