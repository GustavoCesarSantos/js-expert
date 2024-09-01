import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 2,
    duration: "10s",
    threshoulds: {
        http_req_duration: ["p(95)<200"],
        http_req_failed: ["rate<0.01"]
    }
};

export default () => {
    const BASE_URL = "http://localhost:8000"
    const headers = { "Content-Type": "application/json" }
  const res = http.get(BASE_URL, {headers});
    check(res, { "status 200": (r) => r.status === 200 })
  sleep(1);
};
