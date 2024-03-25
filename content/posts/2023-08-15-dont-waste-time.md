# Pitfalls, Tweaks, Tricks in Research and Development

Waste less time = Gain more time!

## Avoid re-doing the same things twice

- Avoid building Buildroot twice by saving its configs
- Avoid developing scripts twice
- Don't use all CPUs when you are using WSL
- Don't delete files randomly

## Make sure the servers are running all the time not you.

## Other pitfalls

- Sogoupinyin doesn't work on Ubuntu
- `ssh -X` forwards X11 back to your desktop (qemu `gtk initialization failed`)
- Don't use `git submodules`
- Run [shellchecker](https://github.com/koalaman/shellcheck) before running any bash/sh script
- Server restarted was due to out of memory
- Server not responding was due to a dead loop
- Don't play with Python's built-in functions and fields