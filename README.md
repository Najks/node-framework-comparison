# Node.js Framework Performance Comparison Study

## Overview

This repository contains a comprehensive performance comparison study of six popular Node.js web frameworks. The study evaluates frameworks across multiple metrics including requests per second (RPS), throughput, and latency under various load conditions.

## Frameworks Tested

1. **Express.js** (v4.16.1) - The most popular Node.js web framework
2. **Fastify** (v5.4.0) - High-performance web framework with focus on speed
3. **Koa.js** (v3.0.0) - Next-generation web framework by the Express team
4. **Restify** (v11.1.0) - Optimized framework for building REST APIs
5. **Sails.js** (v1.5.14) - Full-featured MVC framework
6. **NestJS** (v11.0.7) - TypeScript-first framework with dependency injection

## Test Methodology

### Test Environment
- **Runtime**: Node.js v20.13.1
- **Operating System**: Windows 11 24H2
- **Hardware**: Intel i7-1165G7, 16GB RAM
- **Load Testing Tool**: Autocannon

### Test Configuration
- **Connections**: 50, 100, 200 concurrent connections
- **Duration**: 10 seconds per test
- **Pipelining**: 10 requests per connection
- **Warmup**: 2-second warmup period before each test
- **Endpoints Tested**:
  - `/json` - Simple JSON response
  - `/nested` - Complex nested object response

### Test Parameters
```
Warmup: 5 connections, 10 seconds, 1 pipelining
Actual Test: Variable connections (50/100/200), 40 seconds, 10 pipelining
```

## Implementation Details

Each framework implements identical endpoints:

- **GET /json** - Simple JSON object response: `{hello: "world"}`
- **GET /nested** - Complex nested user object with address and hobbies

All implementations follow framework best practices while maintaining functional equivalence for fair comparison.

## Project Structure

```
framework-comparison/
├── express/           # Express.js implementation
├── fastify/           # Fastify implementation
├── koa/              # Koa.js implementation
├── restify/          # Restify implementation
├── sails/            # Sails.js implementation
├── nest/nest/        # NestJS implementation
├── tests/            # Performance testing scripts
└── results/          # Test results and data
```

## Running the Tests

### Prerequisites
```bash
npm install autocannon
```

### Individual Framework Testing
```bash
# Example of an individual test on Express.js
cd express && npm start

autocannon -c 100 -d 10 -p 10 http://localhost:3001/json
autocannon -c 100 -d 10 -p 10 http://localhost:3001/nested
```

### Comprehensive Testing
```bash
# Test all frameworks with default connections (50, 100, 200)
node tests/test-all.js
```

## Performance Results

### JSON Endpoint Performance

| Framework | 50 Connections | 100 Connections | 200 Connections |
|-----------|----------------|------------------|------------------|
| **Fastify** | 51,052 RPS (9.3ms) | 37,584 RPS (26.2ms) | 35,293 RPS (56.1ms) |
| **Koa** | 26,356 RPS (18.5ms) | 25,882 RPS (38.1ms) | 25,524 RPS (77.8ms) |
| **Restify** | 20,099 RPS (24.4ms) | 24,723 RPS (39.9ms) | 26,584 RPS (74.6ms) |
| **Express** | 9,285 RPS (53.3ms) | 8,315 RPS (119.7ms) | 9,949 RPS (200.2ms) |
| **NestJS** | 7,319 RPS (67.8ms) | 7,362 RPS (135.1ms) | 6,752 RPS (294.9ms) |
| **Sails** | 2,733 RPS (182.1ms) | 1,602 RPS (620.3ms) | 1,763 RPS (1118.6ms) |

### Nested Object Endpoint Performance

| Framework | 50 Connections | 100 Connections | 200 Connections |
|-----------|----------------|------------------|------------------|
| **Fastify** | 35,947 RPS (13.4ms) | 35,433 RPS (27.7ms) | 35,036 RPS (56.6ms) |
| **Koa** | 24,011 RPS (20.3ms) | 23,666 RPS (41.8ms) | 23,518 RPS (84.4ms) |
| **Restify** | 24,236 RPS (20.1ms) | 23,824 RPS (41.5ms) | 23,514 RPS (84.2ms) |
| **Express** | 11,307 RPS (43.7ms) | 10,502 RPS (94.6ms) | 10,765 RPS (184.9ms) |
| **NestJS** | 7,170 RPS (69.2ms) | 7,086 RPS (140.4ms) | 7,143 RPS (278.6ms) |
| **Sails** | 3,621 RPS (137.2ms) | 3,424 RPS (290.8ms) | 3,166 RPS (627.2ms) |

## Performance Visualization

### RPS Performance at 100 Connections

#### JSON Endpoint
```
Fastify  ████████████████████████████████████████████ 37,584 RPS
Koa      ███████████████████████████                  25,882 RPS
Restify  ███████████████████████████████              24,723 RPS
Express  █████████                                     8,315 RPS
NestJS   ████████                                      7,362 RPS
Sails    ██                                            1,602 RPS
```

#### Nested Object Endpoint
```
Fastify  ████████████████████████████████████████████ 35,433 RPS
Koa      ███████████████████████████████              23,666 RPS
Restify  ███████████████████████████████              23,824 RPS
Express  ███████████                                  10,502 RPS
NestJS   ████████                                      7,086 RPS
Sails    ████                                          3,424 RPS
```

### Latency Performance at 100 Connections (Lower is Better)

#### JSON Endpoint
```
Fastify  ███                                          26.2ms
Koa      ████                                         38.1ms
Restify  ████                                         39.9ms
Express  ████████████                                119.7ms
NestJS   ██████████████                              135.1ms
Sails    ████████████████████████████████████████    620.3ms
```

## Performance Tiers

### High Performance Tier (>20,000 RPS)
- **Fastify**: 35,036 - 51,052 RPS (9.3 - 56.6ms latency)
- **Koa**: 23,518 - 26,356 RPS (18.5 - 84.4ms latency)
- **Restify**: 20,099 - 26,584 RPS (20.1 - 84.2ms latency)

### Moderate Performance Tier (5,000 - 20,000 RPS)
- **Express**: 8,315 - 11,307 RPS (43.7 - 200.2ms latency)
- **NestJS**: 6,752 - 7,362 RPS (67.8 - 294.9ms latency)

### Framework-Heavy Tier (<5,000 RPS)
- **Sails**: 1,602 - 3,621 RPS (137.2 - 1118.6ms latency)

## Analysis and Findings

### Performance Rankings by RPS (100 Connections, JSON)
1. **Fastify** - 37,584 RPS (26.2ms) - Clear winner with 45% higher RPS than second place
2. **Koa** - 25,882 RPS (38.1ms) - Excellent async/await performance
3. **Restify** - 24,723 RPS (39.9ms) - Strong API-focused performance
4. **Express** - 8,315 RPS (119.7ms) - Moderate performance with extensive ecosystem
5. **NestJS** - 7,362 RPS (135.1ms) - TypeScript overhead visible
6. **Sails** - 1,602 RPS (620.3ms) - Full-stack framework overhead

### Throughput Performance (100 Connections)
- **Fastify JSON**: 6,900 KB/s
- **Fastify Nested**: 11,073 KB/s  
- **Koa**: 4,727-7,372 KB/s
- **Restify**: 4,732-7,631 KB/s
- **Express**: 1,859-3,702 KB/s
- **NestJS**: 1,811-2,657 KB/s
- **Sails**: 449-1,401 KB/s

### Scalability Analysis

**Under Load (200 Connections):**
- **Fastify**: Maintains 35,000+ RPS with graceful latency degradation
- **Koa/Restify**: Stable performance around 23,000-26,000 RPS
- **Express**: Slight improvement to ~10,000 RPS under higher load
- **NestJS**: Consistent ~7,000 RPS across all connection levels
- **Sails**: Significant performance degradation under load (latency >1000ms)

### Key Observations

1. **Fastify dominance**: Consistently 40-50% faster than nearest competitors
2. **Koa vs Restify**: Nearly identical performance, showcasing efficient minimal frameworks
3. **Express scaling**: Actually improves slightly under higher concurrent load
4. **NestJS consistency**: Stable performance regardless of load level
5. **Sails degradation**: Severe performance penalties under concurrent load
6. **Nested vs JSON**: Minimal performance difference for most frameworks, indicating efficient JSON serialization

## Limitations and Considerations

1. **Synthetic benchmarks**: Real-world applications include database operations, business logic, and external service calls
2. **Hardware dependency**: Results may vary significantly across different hardware configurations
3. **Network conditions**: Local testing eliminates network latency factors
4. **Framework configuration**: Default configurations may not represent optimal production setups
5. **Version specificity**: Results are tied to specific framework versions tested

## Reproducibility

All test configurations, server implementations, and testing scripts are included in this repository. Tests can be reproduced by:

1. Cloning the repository
2. Installing dependencies in each framework directory
3. Running the provided test scripts
4. Comparing results with provided baseline data

## Conclusion

This study provides quantitative performance data for Node.js framework selection decisions. However, framework choice should consider multiple factors including:

- Development team expertise
- Project requirements and complexity
- Long-term maintenance considerations
- Ecosystem and community support
- Performance requirements relative to other system bottlenecks

Performance should be one factor among many in architectural decision-making processes.

These results demonstrate clear performance tiers, with minimalist frameworks (Fastify, Koa, Restify) significantly outperforming full-featured frameworks (Express, NestJS, Sails) in raw throughput scenarios.

## Data and Reproducibility

Raw test data, detailed results, and analysis scripts are available in the `/results` directory. All implementations follow identical functional specifications to ensure fair