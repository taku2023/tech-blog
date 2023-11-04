import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, Table, TableClass, ITableV2 } from "aws-cdk-lib/aws-dynamodb";
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
      readCapacity: 2,
      writeCapacity: 1,
      
    })
    table.addLocalSecondaryIndex({
      sortKey:{
        name: 'LSI1SK',
        type: AttributeType.STRING
      },
      indexName: 'LSI1'
    })
    this.table = table
  }
}