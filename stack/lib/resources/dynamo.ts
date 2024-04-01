import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, Table, TableClass, ITableV2, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class MyTable extends Construct{

  public table:ITableV2;
  constructor(scope:Construct,id:string){
    super(scope,id)

    const table = new Table(this,"MyTable",{
      tableClass: TableClass.STANDARD,
      partitionKey:{
        name: 'PK',
        type: AttributeType.STRING
      },
      sortKey:{
        name: 'SK',
        type: AttributeType.STRING
      },  
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    })
    this.table = table
  }
}