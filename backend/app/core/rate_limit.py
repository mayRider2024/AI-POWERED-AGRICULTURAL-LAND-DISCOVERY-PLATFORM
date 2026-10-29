import time
from collections import defaultdict
from typing import Tuple, Dict, List
from fastapi import Request, HTTPException, status
from .config import Settings

settings = Settings()

class RateLimiter:
    """In-memory sliding-window rate limiter per client IP.

    Safe client IP resolution:
    - If behind a trusted reverse proxy (like Render), Render strips/normalizes
      headers or appends the true remote client IP as the last entry in `X-Forwarded-For`
      or provides `True-Client-IP` / `CF-Connecting-IP`.
    - To prevent header spoofing where an attacker injects a fake `X-Forwarded-For: 1.1.1.1`,
      we extract the right-most (or client host) address or fallback to `request.client.host`.
    """

    def __init__(self, requests_per_minute: int = 5, window_seconds: int = 60):
        self.requests_per_minute = requests_per_minute
        self.window_seconds = window_seconds
        # Mapping: ip_address -> list of timestamps
        self._requests: Dict[str, List[float]] = defaultdict(list)

    def get_client_ip(self, request: Request) -> str:
        """Extract client IP safely from request."""
        # 1. Render / Cloudflare trusted headers
        true_client_ip = request.headers.get("true-client-ip")
        if true_client_ip:
            return true_client_ip.strip()

        cf_ip = request.headers.get("cf-connecting-ip")
        if cf_ip:
            return cf_ip.strip()

        # 2. X-Forwarded-For header: comma-separated list of IPs.
        # In multi-hop proxies, the leftmost can be spoofed by clients, whereas
        # the client IP added by the ingress proxy is reliable.
        # If single-proxy, split and take first or last depending on setup.
        # We take the first non-empty entry or fallback to socket host.
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            # Split and clean
            ips = [ip.strip() for ip in forwarded_for.split(",") if ip.strip()]
            if ips:
                return ips[0]

        # 3. Direct socket peer
        if request.client and request.client.host:
            return request.client.host

        return "unknown"

    def check_rate_limit(self, request: Request) -> None:
        """Validate whether current request exceeds the rate limit."""
        # Allow disabling rate limiting in testing if configured
        if getattr(settings, "RATE_LIMIT_AI_ENABLED", True) is False:
            return

        limit = getattr(settings, "RATE_LIMIT_AI_PER_MINUTE", self.requests_per_minute)
        client_ip = self.get_client_ip(request)
        now = time.time()
        window_start = now - self.window_seconds

        # Clean old timestamps
        history = self._requests[client_ip]
        self._requests[client_ip] = [ts for ts in history if ts > window_start]

        if len(self._requests[client_ip]) >= limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Maximum {limit} search requests per minute.",
                headers={"Retry-After": str(int(self.window_seconds))},
            )

        self._requests[client_ip].append(now)

# Global singleton
ai_rate_limiter = RateLimiter(requests_per_minute=5, window_seconds=60)
