#!/usr/bin/env node

import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';

async function triggerCloudBuild() {
  try {
    const auth = new GoogleAuth({
      keyFile: './googleServiceAccount.json',
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const client = await auth.getClient();
    const projectId = 'core-trees-448409-c5';
    
    const accessToken = await client.getAccessToken();
    
    // 手动触发构建
    const buildConfig = {
      source: {
        repoSource: {
          projectId: projectId,
          repoName: 'github_poghappy_n8n',
          branchName: 'master'
        }
      },
      steps: [
        {
          name: 'gcr.io/cloud-builders/docker',
          args: [
            'build',
            '-t', `gcr.io/${projectId}/hawaiihub-automation:$BUILD_ID`,
            '-t', `gcr.io/${projectId}/hawaiihub-automation:latest`,
            '.'
          ]
        },
        {
          name: 'gcr.io/cloud-builders/docker',
          args: ['push', `gcr.io/${projectId}/hawaiihub-automation:$BUILD_ID`]
        },
        {
          name: 'gcr.io/cloud-builders/docker',
          args: ['push', `gcr.io/${projectId}/hawaiihub-automation:latest`]
        },
        {
          name: 'gcr.io/google.com/cloudsdktool/cloud-sdk',
          entrypoint: 'gcloud',
          args: [
            'run', 'deploy', 'hawaiihub-automation',
            '--image', `gcr.io/${projectId}/hawaiihub-automation:$BUILD_ID`,
            '--region', 'us-central1',
            '--platform', 'managed',
            '--allow-unauthenticated',
            '--port', '3000'
          ]
        }
      ]
    };

    const response = await fetch(
      `https://cloudbuild.googleapis.com/v1/projects/${projectId}/builds`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(buildConfig)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${error}`);
    }

    const result = await response.json();
    console.log('✅ 构建已触发！');
    console.log(`构建 ID: ${result.metadata.build.id}`);
    console.log(`状态: ${result.metadata.build.status}`);
    console.log(`日志 URL: ${result.metadata.build.logUrl}`);

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

triggerCloudBuild();