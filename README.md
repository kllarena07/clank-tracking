# Clank Tracking

## ✍ About

This project was inspired by:

<img width="601" height="633" alt="Screenshot 2025-11-27 at 10 41 39 PM" src="https://github.com/user-attachments/assets/88d239e8-8ee6-4714-a982-1210fbdd9dd8" />

Link to the Tweet [here](https://x.com/CiaraACade/status/1994238097215656408?s=20).

Please note that this app is **100% vibecoded**.

The way that this project works is by connecting your local machine to the dashboard is by using a tool called [mitmproxy](https://www.mitmproxy.org/), an open-source interactive HTTPS proxy for inspecting and modifying traffic. A ["mitmproxy addon"](https://docs.mitmproxy.org/stable/addons/overview/) is used to inspect the network requests of your local machine and look for any URLs that resemble a coding agent. This addon then updates the leaderboard via a webhook.

## 🔧 Setup

The setup is an easy 3 step process.

1. Install mitmproxy by following the tutorial [here](https://youtu.be/7BXsaU42yok?si=OLRoWVG0atnmPHGN)
2. Run `mitmproxy` in your terminal using the following addon:
```
# clank_tracking.py
# mitmproxy_hello.py
import re
import threading
from difflib import SequenceMatcher

import requests
from mitmproxy import ctx, http


def update_leaderboard():
    """
    Updates the AI query leaderboard.
    First tries to increment existing user, if not found creates new user.
    """
    try:
        # Try to increment existing user first
        patch_data = {"name": USERNAME}
        patch_response = requests.patch(
            LEADERBOARD_API_URL,
            json=patch_data,
            headers={"Content-Type": "application/json"},
        )

        if patch_response.status_code == 200:
            ctx.log.info(
                f"Incremented user queries. Status: {patch_response.status_code}"
            )
        elif patch_response.status_code == 404:
            # User not found, create new user
            post_data = {"name": USERNAME, "queries": 1}
            post_response = requests.post(
                LEADERBOARD_API_URL,
                json=post_data,
                headers={"Content-Type": "application/json"},
            )
            if post_response.status_code == 201:
                ctx.log.info(f"Created new user. Status: {post_response.status_code}")
            else:
                ctx.log.error(
                    f"Failed to create user. Status: {post_response.status_code}"
                )
        else:
            ctx.log.error(f"Unexpected PATCH response: {patch_response.status_code}")

    except Exception as e:
        ctx.log.error(f"Failed to update leaderboard: {e}")


def fuzzy_match(text, patterns, threshold=0.6):
    """
    Perform fuzzy matching of text against a list of patterns.
    Returns True if any pattern matches above the threshold.
    """
    text_lower = text.lower()

    for pattern in patterns:
        pattern_lower = pattern.lower()
        similarity = SequenceMatcher(None, pattern_lower, text_lower).ratio()
        if similarity >= threshold:
            return True

    return False


# Configuration
LEADERBOARD_API_URL = "[url]/api/leaderboard"
USERNAME = "your_name"

# Possible strings to fuzzy match against
POSSIBLE_STRINGS = [
    "http://api2.cursor.sh/aiserver.v1.ChatService/StreamUnifiedChatWithToolsSSE"
]


class HelloAddon:
    def request(self, flow: http.HTTPFlow):
        url = flow.request.pretty_url

        # Check if URL matches any possible strings using fuzzy search
        if fuzzy_match(url, POSSIBLE_STRINGS, threshold=0.6):
            ctx.log.info(f"Detected coding agent request: {url}")
            threading.Thread(target=update_leaderboard, daemon=True).start()


addons = [HelloAddon()]
```
>Please note that this addon is NOT EXHAUSTIVE for all coding agent URLs and only contains patterns to the ones that I am aware of. If you like, you can feel free to submit a PR adding more patterns.
3. Clank (or don't) away

## 👾 Bugs or vulnerabilities

If you find any bugs or vulnerabilities, please contact me on my Twitter using the link below.

_Vibecoded with ❤️ by [krayondev](https://x.com/krayondev)_
