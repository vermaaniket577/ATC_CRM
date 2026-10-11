# Dedicated Virtual Private Cloud
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.app_name}-vpc"
  }
}

# Internet Gateway for Public Tier
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.app_name}-igw"
  }
}

# Public Subnets (ALB & NAT Gateways across 2 Availability Zones)
resource "aws_subnet" "public_1a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.app_name}-pub-sub-1a"
    Tier = "Public"
  }
}

resource "aws_subnet" "public_1b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.app_name}-pub-sub-1b"
    Tier = "Public"
  }
}

# Private App Subnets (Spring Boot EC2 Instances)
resource "aws_subnet" "private_app_1a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "${var.app_name}-app-sub-1a"
    Tier = "PrivateApp"
  }
}

resource "aws_subnet" "private_app_1b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "${var.app_name}-app-sub-1b"
    Tier = "PrivateApp"
  }
}

# Private Database Subnets (Amazon RDS Multi-AZ MySQL)
resource "aws_subnet" "private_db_1a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.20.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "${var.app_name}-db-sub-1a"
    Tier = "PrivateDB"
  }
}

resource "aws_subnet" "private_db_1b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.21.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "${var.app_name}-db-sub-1b"
    Tier = "PrivateDB"
  }
}

# Elastic IPs & NAT Gateways (High Availability)
resource "aws_eip" "nat_1a" {
  domain = "vpc"
}

resource "aws_nat_gateway" "nat_1a" {
  allocation_id = aws_eip.nat_1a.id
  subnet_id     = aws_subnet.public_1a.id

  tags = {
    Name = "${var.app_name}-nat-gw-1a"
  }
}

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "${var.app_name}-public-rt"
  }
}

resource "aws_route_table_association" "pub_1a" {
  subnet_id      = aws_subnet.public_1a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "pub_1b" {
  subnet_id      = aws_subnet.public_1b.id
  route_table_id = aws_route_table.public.id
}

# Private App Route Table (via NAT Gateway)
resource "aws_route_table" "private_app" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_1a.id
  }

  tags = {
    Name = "${var.app_name}-private-app-rt"
  }
}

resource "aws_route_table_association" "app_1a" {
  subnet_id      = aws_subnet.private_app_1a.id
  route_table_id = aws_route_table.private_app.id
}

resource "aws_route_table_association" "app_1b" {
  subnet_id      = aws_subnet.private_app_1b.id
  route_table_id = aws_route_table.private_app.id
}

# Isolated Private DB Route Table (No Internet Access)
resource "aws_route_table" "private_db" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.app_name}-private-db-rt"
  }
}

resource "aws_route_table_association" "db_1a" {
  subnet_id      = aws_subnet.private_db_1a.id
  route_table_id = aws_route_table.private_db.id
}

resource "aws_route_table_association" "db_1b" {
  subnet_id      = aws_subnet.private_db_1b.id
  route_table_id = aws_route_table.private_db.id
}
