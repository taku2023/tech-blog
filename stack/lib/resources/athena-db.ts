import * as glue_alpha from "@aws-cdk/aws-glue-alpha";
import { RemovalPolicy, aws_athena } from "aws-cdk-lib";
import { CfnWorkGroup } from "aws-cdk-lib/aws-athena";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { appContext } from "../../bin/config";


export class AthenaDatabase extends Construct{

  public readonly dataBucket: IBucket
  public readonly outputBucket: IBucket;
  public readonly workgroup: CfnWorkGroup
  public readonly table: glue_alpha.Table


  constructor(scope:Construct,id:string){
    super(scope,id)

    const {athena} = appContext(this)

    const dataBucket = new Bucket(this,"DataBucket",{
      publicReadAccess: false,      
      autoDeleteObjects: true,          
      removalPolicy: RemovalPolicy.DESTROY
    })     
    const resultOutputBucket = new Bucket(this,"OutputResultBucket",{
      publicReadAccess:false,
      autoDeleteObjects: true,          
      removalPolicy: RemovalPolicy.DESTROY
    })

    const database = new glue_alpha.Database(this,"GlueDatabase")

    const table = new glue_alpha.Table(this,"GlueTable",{
      tableName: athena.tableName,
      database,
      dataFormat: glue_alpha.DataFormat.JSON,
      bucket: dataBucket,      
      partitionKeys:[{
        name: 's3_dir',
        type: glue_alpha.Schema.STRING
      }],      
      columns:[
        {
          name: 'title',
          type: glue_alpha.Schema.STRING
        },{
          name: 'description',
          type: glue_alpha.Schema.STRING,
        },{
          name: 'categories',
          type: glue_alpha.Schema.array(glue_alpha.Schema.STRING)
        },
        {
          name: 'keywords',
          type: glue_alpha.Schema.array(glue_alpha.Schema.STRING)
        },{
          name: 'create_at',
          type: glue_alpha.Schema.STRING
        }
      ]
    })

    
    const athenaWG = new CfnWorkGroup(this,"AthenaWorkGroup",{
      name: athena.workGroup,
      workGroupConfiguration:{
        engineVersion:{
          selectedEngineVersion: 'Athena engine version 3'
        },
        resultConfiguration:{
          outputLocation:  `s3://${resultOutputBucket.bucketName}`
        }
      }
    })
    
    
    this.setupPreparedStatement(athenaWG.name,database.databaseName,table.tableName)
    this.dataBucket = dataBucket
    this.workgroup = athenaWG
    this.table = table;
    this.outputBucket  = resultOutputBucket;
  }

  private setupPreparedStatement(workGroup:string,database:string,table:string){
    new aws_athena.CfnPreparedStatement(this,"GetBlog",{
      workGroup,
      statementName: 'GetBlog',
      queryStatement: `SELECT * FROM ${database}.${table} WHERE s3_dir = ? `,      
    })
    
    new aws_athena.CfnPreparedStatement(this,"GetBlogs",{
      workGroup,
      statementName: 'GetBlogs',
      queryStatement: `SELECT * FROM ${database}.${table}  ORDER BY create_at DESC limit  ? `,      
    })
  }
}