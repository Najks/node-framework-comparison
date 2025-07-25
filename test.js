import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    warm_up: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '10s',
      preAllocatedVUs: 10,
      maxVUs: 50,
    },
    high_load: {
      executor: 'constant-arrival-rate',
      rate: 10000,
      timeUnit: '1s',
      duration: '30s',
      startTime: '10s',  // Starts after warm-up
      preAllocatedVUs: 100,
      maxVUs: 500,
    },
    stress_test: {
      executor: 'constant-arrival-rate',
      rate: 25000,
      timeUnit: '1s',
      duration: '30s',
      startTime: '40s',  // Starts after high_load
      preAllocatedVUs: 200,
      maxVUs: 1000,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],     // Error rate <5%
    http_req_duration: ['p(95)<500', 'p(99)<1000'],  // Combined latency thresholds
  },
};

export default function () {
  const res = http.get('http://localhost:3000/');
  
  // Validate:
  // 1. Status is 200
  // 2. Response is JSON
  // 3. Body matches { message: "Hello, World!" }
  check(res, {
  'Status is 200': (r) => r.status === 200,
  'Response is correct': (r) => {
    try {
      const body = r.json();
      return body.hello === 'world'; // Match actual response
      // OR if the response is {"message":"..."}:
      // return body.message === 'Hello, World!';
    } catch (e) {
      return false;
    }
  },
});
}