# 本地打包 + 服务器部署指南

适用于：**服务器内存较小（如 2G），无法在服务器上完成 Docker 构建**，需要在本地（Mac）构建镜像后传到服务器运行。

项目使用 `docker-compose.yml` 中的 `image: new-api:local`，通过完整 `Dockerfile` 打包前后端。

---

## 前置要求

| 项目 | 要求 |
|------|------|
| 本地机器 | 已安装 Docker Desktop，能正常执行 `docker compose` |
| 服务器 | 已安装 Docker、Docker Compose |
| 服务器架构 | 通常为 `linux/amd64`（常见云 VPS） |
| 项目文件 | 服务器上需有 `docker-compose.yml`（及 `data/`、`logs/` 目录会自动创建） |

> **Apple 芯片 Mac（M1/M2/M3）**：构建时必须指定 `linux/amd64`，否则镜像无法在 x86 服务器上运行。

---

## 首次部署

### 一、本地构建镜像（Mac）

```bash
# 1. 进入项目目录
cd /path/to/new-api

# 2. 构建镜像（Apple 芯片 Mac 必须加平台参数）
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build

# Intel Mac 可省略环境变量：
# docker compose build

# 3. 确认镜像已生成
docker images | grep new-api
# 应看到：new-api   local   ...

# 4. （可选）确认 CPU 架构
docker inspect new-api:local --format '{{.Architecture}}'
# 服务器为 x86 时应输出：amd64
```

### 二、导出并上传到服务器

```bash
# 5. 导出为压缩包
docker save new-api:local | gzip > new-api.tar.gz

# 6. 查看文件大小
ls -lh new-api.tar.gz

# 7. 上传到服务器（替换为实际 IP 和路径）
scp new-api.tar.gz root@你的服务器IP:/var/www/new-api/
```

也可通过 SFTP 工具（如 Cursor、FileZilla）将 `new-api.tar.gz` 拖到服务器项目目录。

### 三、服务器导入并启动

```bash
# 8. SSH 登录服务器
ssh root@你的服务器IP

# 9. 进入项目目录
cd /var/www/new-api

# 10. 导入镜像
docker load < new-api.tar.gz

# 11. 确认镜像
docker images | grep new-api
# 应看到：new-api   local   ...

# 12. 首次启动（不要加 --build）
docker compose up -d
```

> 首次启动会自动拉取 `postgres`、`redis` 镜像；`new-api` 使用刚导入的 `new-api:local`。

### 四、验证

```bash
# 查看容器状态
docker compose ps

# 检查 API
curl http://localhost:3000/api/status

# 浏览器访问
# http://服务器IP:3000
```

---

## 日常更新部署（代码有变更时）

每次修改 **Go 后端** 或 **前端 `web/`** 后，需重新构建并部署。

### 本地（Mac）

```bash
cd /path/to/new-api

DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build
docker save new-api:local | gzip > new-api.tar.gz
scp new-api.tar.gz root@你的服务器IP:/var/www/new-api/
```

### 服务器

```bash
cd /var/www/new-api

docker load < new-api.tar.gz
docker compose up -d --no-deps new-api
```

`--no-deps` 表示只重启 `new-api` 容器，不影响 `postgres` 和 `redis`。

### 清理传输包（可选）

```bash
rm new-api.tar.gz
```

导入成功后删除压缩包不影响运行。

---

## 仅改配置时（无需重新打包）

以下变更**不需要**重新 build 镜像，改完配置后重启即可：

- `docker-compose.yml` 中的环境变量（密码、`TZ`、`SESSION_SECRET` 等）
- 端口映射
- `./data` 目录下的运行时数据

```bash
cd /var/www/new-api
docker compose up -d
# 或只重启应用
docker compose up -d --no-deps new-api
```

---

## 一键部署脚本（可选）

在 Mac 项目根目录创建 `scripts/deploy-local.sh`：

```bash
#!/bin/bash
set -e

SERVER="root@你的服务器IP"
REMOTE_DIR="/var/www/new-api"

echo ">>> 构建镜像..."
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build

echo ">>> 导出镜像..."
docker save new-api:local | gzip > new-api.tar.gz

echo ">>> 上传到服务器..."
scp new-api.tar.gz "$SERVER:$REMOTE_DIR/"

echo ">>> 服务器部署..."
ssh "$SERVER" "cd $REMOTE_DIR && docker load < new-api.tar.gz && docker compose up -d --no-deps new-api"

echo ">>> 部署完成"
```

使用前修改 `SERVER` 和 `REMOTE_DIR`，并赋予执行权限：

```bash
chmod +x scripts/deploy-local.sh
./scripts/deploy-local.sh
```

---

## 常见问题

### 1. 服务器上报 `exec format error`

Mac 为 Apple 芯片，构建时未指定平台。重新执行：

```bash
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build --no-cache
```

### 2. `docker compose up` 又开始 build

启动时**不要**加 `--build`。确保 `docker-compose.yml` 中配置了 `image: new-api:local`，且已执行 `docker load`。

### 3. 端口 3000 被占用

修改 `docker-compose.yml`：

```yaml
ports:
  - "3001:3000"
```

然后访问 `http://服务器IP:3001`。

### 4. 容器启动失败

```bash
docker compose logs -f new-api
```

### 5. 生产环境密码

部署前务必修改 `docker-compose.yml` 中所有默认密码（PostgreSQL、Redis、`SQL_DSN`、`REDIS_CONN_STRING`），并设置 `SESSION_SECRET`（多节点部署时必需）。

---

## 命令速查

| 步骤 | 位置 | 命令 |
|------|------|------|
| 构建 | Mac | `DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build` |
| 导出 | Mac | `docker save new-api:local \| gzip > new-api.tar.gz` |
| 上传 | Mac | `scp new-api.tar.gz root@IP:/var/www/new-api/` |
| 导入 | 服务器 | `docker load < new-api.tar.gz` |
| 首次启动 | 服务器 | `docker compose up -d` |
| 更新应用 | 服务器 | `docker compose up -d --no-deps new-api` |
| 查看状态 | 服务器 | `docker compose ps` |
| 查看日志 | 服务器 | `docker compose logs -f new-api` |

---

## 与开发环境的区别

| 场景 | 使用文件 | 说明 |
|------|----------|------|
| 本地二次开发 | `docker-compose.dev.yml` | 后端 Docker + 前端 `bun run dev` 热更新 |
| 生产/服务器部署 | `docker-compose.yml` + 本地打包 | 完整前后端打进镜像 |

开发环境**不要**用于服务器生产部署。
