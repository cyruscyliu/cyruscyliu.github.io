---
date: 2023-08-15
---

# Pitfalls, Tweaks, Tricks in Research and Development

Waste less time = Gain more time!

## Avoid re-doing the same things twice

- Avoid building Buildroot twice by saving its configs
- Avoid developing scripts twice
- Don't use all CPUs when you are using WSL
- Don't delete files randomly

## Make sure the servers are running all the time not you

## Proxies Setup List

- Setup Proxy for google, GitHub, Docker, apt sources
- Proxy setup for WSL: 1) allow LAN, 2) access the host in WSL,
https://learn.microsoft.com/en-us/windows/wsl/networking, 3) enable system proxy

## Cloud storage for remote work

- Google Driver/Nutshore/GitHub/servers
- Commit and push before going home 

## Other pitfalls

- Sogoupinyin doesn't work on Ubuntu
- `ssh -X` forwards X11 back to your desktop (qemu `gtk initialization failed`)
- Don't use `git submodules`
- Run [shellchecker](https://github.com/koalaman/shellcheck) before running any bash/sh script
- Server restarted was due to out of memory
- Server not responding was due to a dead loop
- Don't play with Python's built-in functions and fields