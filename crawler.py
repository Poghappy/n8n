import requests
from bs4 import BeautifulSoup
import os

# 设置要爬取的URL
url = "https://help.kumanyun.com/help-220.html"

# 发送HTTP请求
response = requests.get(url)
response.encoding = 'utf-8'  # 设置编码

# 解析HTML内容
soup = BeautifulSoup(response.text, 'html.parser')

# 查找所有链接
links = soup.find_all('a')

# 创建一个目录来保存下载的文件
os.makedirs('downloads', exist_ok=True)

# 遍历所有链接
for link in links:
    href = link.get('href')
    if href and href.endswith('.pdf'):  # 假设文档是PDF格式
        file_url = href if href.startswith('http') else url + href
        file_name = os.path.join('downloads', os.path.basename(file_url))
        
        # 下载文件
        file_response = requests.get(file_url)
        with open(file_name, 'wb') as file:
            file.write(file_response.content)
        print(f"Downloaded: {file_name}")