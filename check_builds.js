#!/usr/bin/env node

import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';

async function getCloudBuilds() {
  try {
    // 使用 Service Account 进行身份验证
    const auth = new GoogleAuth({
      keyFile: './googleServiceAccount.json',
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const client = await auth.getClient();
    const projectId = 'core-trees-448409-c5';
    
    // 获取访问令牌
    const accessToken = await client.getAccessToken();
    
    // 调用 Cloud Build API
    const response = await fetch(
      `https://cloudbuild.googleapis.com/v1/projects/${projectId}/builds?pageSize=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('=== 最近的 Cloud Build 记录 ===');
    if (data.builds && data.builds.length > 0) {
      data.builds.forEach((build, index) => {
        console.log(`\n构建 ${index + 1}:`);
        console.log(`  ID: ${build.id}`);
        console.log(`  状态: ${build.status}`);
        console.log(`  创建时间: ${build.createTime}`);
        console.log(`  源: ${build.source?.repoSource?.repoName || 'N/A'}`);
        console.log(`  分支: ${build.source?.repoSource?.branchName || 'N/A'}`);
        if (build.logUrl) {
          console.log(`  日志URL: ${build.logUrl}`);
        }
      });
    } else {
      console.log('没有找到构建记录');
    }

  } catch (error) {
    console.error('错误:', error.message);
  }
}

getCloudBuilds();