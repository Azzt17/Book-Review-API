# Laporan Deployment

## Informasi Project
- **Repo GitHub:** https://github.com/Azzt17/Book-Review-API/tree/main
- **Production URL:** http://54.161.153.26:3000
- **Health Check:** http://54.161.153.26:3000/api

## Detail AWS EC2
- **Instance ID:** i-0bc4bc8ec59113c51
- **Type:** t2.micro
- **Region:** us-east-1
- **OS:** Ubuntu Server 22.04 LTS

## Langkah Deployment
1.  Launch EC2 Instance (t2.micro, Ubuntu).
2.  Setup Security Group (Open Port 22, 80, 3000).
3.  SSH ke server.
4.  Install Node.js 18, NPM, Git, Docker.
5.  Clone repository.
6.  Setup `.env` production.
7.  Build Docker Image: `docker build -t app .`
8.  Run Container: `docker run -d -p 3000:3000 --env-file .env app`

## Monitoring
- Cek status container: `docker ps`
- Cek logs: `docker logs <container_id>`