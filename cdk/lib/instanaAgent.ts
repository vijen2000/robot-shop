import * as cdk from '@aws-cdk/core';
import * as ecs from "@aws-cdk/aws-ecs";
import { isUndefined } from 'util';

export interface InstanaEnvProps{
    INSTANA_AGENT_ENDPOINT: string,
    INSTANA_AGENT_ENDPOINT_PORT: string,
    INSTANA_AGENT_KEY: string,
    INSTANA_EUM_KEY: string,
    INSTANA_EUM_REPORTING_URL: string
}

export class InstanaEcsAgent {
    constructor(scope: cdk.Construct, cluster: ecs.Cluster, instanaEnvProps?: InstanaEnvProps){
        if (instanaEnvProps === undefined) return;

        const instanaAgentTask = new ecs.Ec2TaskDefinition(scope, "InstanaAgentTask", {
            networkMode: ecs.NetworkMode.HOST,
            ipcMode: ecs.IpcMode.HOST,
            pidMode: ecs.PidMode.HOST,
            volumes: [
              {
                name: "dev",
                host: { sourcePath: "/dev" },
                dockerVolumeConfiguration: undefined
              },
              {
                name: "sys",
                host: { sourcePath: "/sys" },
                dockerVolumeConfiguration: undefined
              },
              {
                name: "var_run",
                host: { sourcePath: "/var/run" },
                dockerVolumeConfiguration: undefined
              },
              {
                name: "run",
                host: { sourcePath: "/run" },
                dockerVolumeConfiguration: undefined
              },
              {
                name: "log",
                host: { sourcePath: "/var/log" },
                dockerVolumeConfiguration: undefined
              }
            ]
          });
      
          instanaAgentTask.addContainer("InstanaAgentContainer", {
            image: ecs.ContainerImage.fromRegistry("instana/agent"),
            memoryReservationMiB: 512,
            privileged: true,
            environment: {
              "INSTANA_AGENT_ENDPOINT": instanaEnvProps.INSTANA_AGENT_ENDPOINT,
              "INSTANA_AGENT_ENDPOINT_PORT": instanaEnvProps.INSTANA_AGENT_ENDPOINT_PORT,
              "INSTANA_AGENT_KEY": instanaEnvProps.INSTANA_AGENT_KEY
            }
          }).addMountPoints({
            readOnly: false,
            containerPath: "/var/run",
            sourceVolume: "var_run"
          },
            {
              readOnly: false,
              containerPath: "/run",
              sourceVolume: "run"
            },
            {
              readOnly: false,
              containerPath: "/sys",
              sourceVolume: "sys"
            },
            {
              readOnly: false,
              containerPath: "/dev",
              sourceVolume: "dev"
            },
            {
              readOnly: false,
              containerPath: "/var/log",
              sourceVolume: "log"
            })
      
          new ecs.Ec2Service(scope, "InstanaAgent", {
            cluster: cluster,
            taskDefinition: instanaAgentTask,
            daemon: true
          });
    }    
}

export class InstanaFargateAgent {
    constructor(scope: cdk.Construct, cluster: ecs.Cluster, instanaEnvProps?: InstanaEnvProps){
        if (instanaEnvProps === undefined) return;

        const instanaAgentTask = new ecs.FargateTaskDefinition(scope, "InstanaAgentTask", {
            //networkMode: ecs.NetworkMode.HOST,
            //ipcMode: ecs.IpcMode.HOST,
            //pidMode: ecs.PidMode.HOST,
            volumes: [
              {
                name: "dev",
                host: { sourcePath: "/dev" },
                dockerVolumeConfiguration: undefined
              },
              {
                name: "sys",
                host: { sourcePath: "/sys" },
                dockerVolumeConfiguration: undefined
              },
              {
                name: "var_run",
                host: { sourcePath: "/var/run" },
                dockerVolumeConfiguration: undefined
              },
              {
                name: "run",
                host: { sourcePath: "/run" },
                dockerVolumeConfiguration: undefined
              },
              {
                name: "log",
                host: { sourcePath: "/var/log" },
                dockerVolumeConfiguration: undefined
              }
            ]
          });
      
          instanaAgentTask.addContainer("InstanaAgentContainer", {
            image: ecs.ContainerImage.fromRegistry("instana/agent"),
            memoryReservationMiB: 512,
            privileged: true,
            environment: {
              "INSTANA_AGENT_ENDPOINT": instanaEnvProps.INSTANA_AGENT_ENDPOINT,
              "INSTANA_AGENT_ENDPOINT_PORT": instanaEnvProps.INSTANA_AGENT_ENDPOINT_PORT,
              "INSTANA_AGENT_KEY": instanaEnvProps.INSTANA_AGENT_KEY
            }
          }).addMountPoints({
            readOnly: false,
            containerPath: "/var/run",
            sourceVolume: "var_run"
          },
            {
              readOnly: false,
              containerPath: "/run",
              sourceVolume: "run"
            },
            {
              readOnly: false,
              containerPath: "/sys",
              sourceVolume: "sys"
            },
            {
              readOnly: false,
              containerPath: "/dev",
              sourceVolume: "dev"
            },
            {
              readOnly: false,
              containerPath: "/var/log",
              sourceVolume: "log"
            })
      
          new ecs.FargateService(scope, "InstanaAgent", {
            cluster: cluster,
            taskDefinition: instanaAgentTask,
            //daemon: true
          });
    }
}